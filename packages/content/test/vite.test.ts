import * as fs from 'node:fs'
import * as path from 'node:path'

import { describe, expect, it } from 'vitest'

import { blogPosts, contentRoot, projects, talks } from '../collections.ts'
import { content } from '../vite.ts'

/**
 * Pins the Vite plugin against the real `content/` directory: it is the only
 * thing standing between a content file and a broken deploy now that pages read
 * baked data instead of the filesystem.
 *
 * The generated modules are **evaluated**, not just string-matched. A module can
 * be perfectly plausible text and still throw — the first version of this plugin
 * emitted its asset imports before the frontmatter had registered the hero, so
 * every post with a hero image died with `__asset0 is not defined`. That only
 * surfaced during prerender, as `Failed to fetch /blog/…: Internal Server Error`.
 * Evaluating here turns that class of bug into a named assertion failure.
 */

type Hook = (...args: any[]) => any

/** The plugin under test, with its hooks reachable as plain functions. */
function createPlugin() {
  const warnings: string[] = []
  const plugin = content() as unknown as {
    configResolved: Hook
    resolveId: Hook
    load: Hook
  }
  plugin.configResolved({ logger: { warn: (m: string) => warnings.push(m) } })

  const generate = async (id: string): Promise<string> => {
    const resolved = plugin.resolveId(id)
    expect(resolved, `plugin did not claim ${id}`).toBeTruthy()
    const code = await plugin.load(resolved)
    expect(code, `plugin generated nothing for ${id}`).toBeTruthy()
    return code as string
  }

  return { generate, warnings }
}

/**
 * Runs a generated module and returns what it exported.
 *
 * Asset imports are rebound to the file path they point at — the real value is a
 * hashed URL only Vite can produce, and every assertion here cares about *which*
 * file was imported, not what it was renamed to. An identifier that was
 * referenced but never imported is simply absent from the parameter list, so the
 * body throws `ReferenceError` exactly as it did in the browser.
 */
function evaluateModule(code: string) {
  const imports = [...code.matchAll(/^import (\w+) from "([^"]+)"$/gm)]
  const assets = imports.map(([, , specifier]) =>
    specifier!.replace(/\?url$/, ''),
  )
  const body = code
    .replace(/^import .*$/gm, '')
    .replace(/^export default /m, 'exports.default = ')
    .replace(/^export const (\w+) = /gm, 'exports.$1 = ')

  const run = new Function(
    'exports',
    ...imports.map(([, identifier]) => identifier!),
    body,
  )
  const exports: Record<string, any> = {}
  run(exports, ...assets)

  return { exports, assets }
}

/** Document directories on disk, which is what a slug is. */
const slugsOnDisk = (directory: string) =>
  fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()

const LISTINGS = ['blogPosts', 'projects', 'experiences', 'talks'] as const

const DETAIL_COLLECTIONS = [
  { name: 'blogPosts', loader: 'loadBlogPost', collection: blogPosts },
  { name: 'projects', loader: 'loadProject', collection: projects },
  { name: 'talks', loader: 'loadTalk', collection: talks },
] as const

describe('virtual:content', () => {
  it('generates a module that evaluates', async () => {
    const { generate } = createPlugin()
    const { exports } = evaluateModule(await generate('virtual:content'))

    for (const name of LISTINGS) {
      expect(exports[name], `missing export: ${name}`).toBeInstanceOf(Array)
      expect(
        exports[name].length,
        `${name} is empty — the collection did not read`,
      ).toBeGreaterThan(0)
    }
  })

  it('exposes every document on disk, drafts included', async () => {
    const { generate } = createPlugin()
    const { exports } = evaluateModule(await generate('virtual:content'))

    for (const { loader, collection } of DETAIL_COLLECTIONS) {
      expect(Object.keys(exports[loader]).sort()).toEqual(
        slugsOnDisk(collection.directory),
      )
    }
  })

  it('only lists published documents, newest first for the blog', async () => {
    const { generate } = createPlugin()
    const { exports } = evaluateModule(await generate('virtual:content'))

    // The listing filter and ordering live in the readers; this pins that the
    // plugin does not bypass them.
    for (const name of LISTINGS) {
      for (const document of exports[name]) {
        if ('published' in document) expect(document.published).toBe(true)
      }
    }

    const dates = exports.blogPosts.map((post: { date: string }) => post.date)
    expect(dates).toEqual([...dates].sort().reverse())
  })

  it('resolves every frontmatter image to a file that exists', async () => {
    const { generate, warnings } = createPlugin()
    const { assets } = evaluateModule(await generate('virtual:content'))

    for (const asset of assets) {
      expect(fs.existsSync(asset), `imported but missing: ${asset}`).toBe(true)
      expect(asset.startsWith(contentRoot)).toBe(true)
    }
    expect(warnings).toEqual([])
  })
})

describe('virtual:content detail modules', () => {
  it('generates an evaluable module for every document', async () => {
    const { generate, warnings } = createPlugin()

    for (const { name, collection } of DETAIL_COLLECTIONS) {
      for (const slug of slugsOnDisk(collection.directory)) {
        const id = `virtual:content/detail/${name}/${slug}`
        const { exports, assets } = evaluateModule(await generate(id))
        const document = exports.default

        expect(typeof document.html, `${id}: html is not a string`).toBe(
          'string',
        )
        expect(document.title, `${id}: no title`).toBeTruthy()

        for (const asset of assets) {
          expect(fs.existsSync(asset), `${id}: missing image ${asset}`).toBe(
            true,
          )
        }
      }
    }

    // A body image the plugin could not resolve is warned about and left as a
    // relative src, which 404s in the browser. Treat it as a failure here.
    expect(warnings).toEqual([])
  })

  it('rewrites body image srcs to imported assets, never relative paths', async () => {
    const { generate } = createPlugin()

    for (const { name, collection } of DETAIL_COLLECTIONS) {
      for (const slug of slugsOnDisk(collection.directory)) {
        const id = `virtual:content/detail/${name}/${slug}`
        const { exports, assets } = evaluateModule(await generate(id))
        const html: string = exports.default.html

        for (const [, src] of html.matchAll(/<img[^>]*\bsrc="([^"]*)"/g)) {
          if (/^(?:https?:|\/\/|data:)/.test(src!)) continue
          expect(
            assets,
            `${id}: body src "${src}" was not turned into an asset import`,
          ).toContain(src)
        }
      }
    }
  })

  it('refuses a slug that does not exist', async () => {
    const { generate } = createPlugin()
    await expect(
      generate(`virtual:content/detail/blogPosts/does-not-exist`),
    ).rejects.toThrow()
  })

  it('gives each document its own module', async () => {
    const { generate } = createPlugin()
    const slugs = slugsOnDisk(blogPosts.directory)
    expect(slugs.length).toBeGreaterThan(1)

    const bodies = await Promise.all(
      slugs.map(async (slug) => {
        const code = await generate(`virtual:content/detail/blogPosts/${slug}`)
        return evaluateModule(code).exports.default.html
      }),
    )

    // Distinct modules, not one shared blob — that is what makes the per-document
    // chunking real rather than incidental.
    expect(new Set(bodies).size).toBe(bodies.length)
  })
})

describe('content on disk', () => {
  // The name `index.mdx` is a leftover: bodies have been plain markdown since
  // ADR-0007. It is what `@ntatoud/effect-collections` reads, so a document
  // directory without one is invisible to every reader.
  it('gives every document an index.mdx', () => {
    for (const collection of [blogPosts, projects, talks]) {
      for (const slug of slugsOnDisk(collection.directory)) {
        const file = path.join(collection.directory, slug, 'index.mdx')
        expect(fs.existsSync(file), `missing ${file}`).toBe(true)
      }
    }
  })
})
