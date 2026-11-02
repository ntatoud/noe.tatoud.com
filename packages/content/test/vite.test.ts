import * as fs from 'node:fs'
import * as path from 'node:path'

import { describe, expect, it } from 'vitest'

import { blog } from '../catalog/blog.ts'
import { projects as projectsEntry } from '../catalog/projects.ts'
import { talks as talksEntry } from '../catalog/talks.ts'
import { contentRoot } from '../content-url.ts'
import { readContentPages } from '../pages.ts'
import { createPlugin, readDeclaredExports } from './helpers.ts'

// Generated modules are evaluated, not string-matched: a plausible module can still throw `ReferenceError`.

// Asset imports are rebound to their file path; an identifier never imported is absent, so the body throws as in the browser.
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

// A second implementation of the plugin's `readSlugs`: the oracle must not share the code under test.
const slugsOnDisk = (directory: string) =>
  fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()

const LISTINGS = ['blogPosts', 'projects', 'experiences', 'talks'] as const

const blogPosts = blog.collection
const projects = projectsEntry.collection
const talks = talksEntry.collection

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

  // Closes the hole where a typo in a generated export name still typechecks but fails at runtime.
  it('exports exactly the names virtual.d.ts declares', async () => {
    const { generate } = createPlugin()
    const { exports } = evaluateModule(await generate('virtual:content'))

    const declaredNames = readDeclaredExports()

    expect(declaredNames.length).toBeGreaterThan(0)
    expect(Object.keys(exports).sort()).toEqual([...declaredNames].sort())
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

    for (const name of LISTINGS) {
      for (const document of exports[name]) {
        if ('published' in document) expect(document.published).toBe(true)
      }
    }

    const dates = exports.blogPosts.map((post: { date: string }) => post.date)
    expect(dates).toEqual([...dates].sort().reverse())
  })

  it('exports the content pages the build reads from disk', async () => {
    const { generate } = createPlugin()
    const { exports } = evaluateModule(await generate('virtual:content'))

    expect(exports.contentInventory).toEqual(await readContentPages())
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
          // Stricter than the plugin's `ABSOLUTE_SRC`: nothing serves `content/` at runtime, so no image may come out as `/...`.
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

    expect(new Set(bodies).size).toBe(bodies.length)
  })
})

describe('content on disk', () => {
  // `index.mdx` is what `@ntatoud/effect-collections` reads: a directory without one is invisible to every reader.
  it('gives every document an index.mdx', () => {
    for (const collection of [blogPosts, projects, talks]) {
      for (const slug of slugsOnDisk(collection.directory)) {
        const file = path.join(collection.directory, slug, 'index.mdx')
        expect(fs.existsSync(file), `missing ${file}`).toBe(true)
      }
    }
  })
})
