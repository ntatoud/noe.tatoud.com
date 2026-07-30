import * as fs from 'node:fs'
import * as path from 'node:path'

import { CollectionsLive } from '@ntatoud/effect-collections'

import { ManagedRuntime } from 'effect'
import type { Plugin } from 'vite'

import {
  blogPosts as blogPostsCollection,
  contentRoot,
  projects as projectsCollection,
  talks as talksCollection,
} from './collections.ts'
import { getBlogPost, getBlogPosts } from './readers/blog.ts'
import { getExperiences } from './readers/experiences.ts'
import { getProject, getProjects } from './readers/projects.ts'
import { getTalk, getTalks } from './readers/talks.ts'

/**
 * Reads every collection at build time and serves the result as a virtual
 * module, so no page needs a serverless function to display content.
 *
 * Content is data in the repo: it can only change on deploy. Reading it per
 * request (ADR-0006) meant every client-side navigation paid an RPC into a
 * Netlify function, and a cold instance spent seconds loading the markdown and
 * highlighting stack before it could answer. This plugin moves that work to the
 * build — see ADR-0008.
 *
 * Two shapes are emitted, matching the two ways pages read content:
 *
 * - `virtual:content` — the listing arrays, eagerly. They carry only frontmatter
 *   for a handful of documents, so they are cheap to ship in the entry bundle.
 * - `virtual:content/detail/<collection>/<slug>` — one module per document,
 *   holding its rendered `html`. Reached exclusively through the `load*` maps as
 *   a dynamic import, so Rollup gives each document its own chunk and a detail
 *   page downloads only its own body.
 */

const VIRTUAL_ID = 'virtual:content'
const DETAIL_PREFIX = `${VIRTUAL_ID}/detail/`

// Rollup convention: the resolved id of a module with no file on disk is
// prefixed with NUL, marking it as owned by a plugin so nothing else tries to
// read it off the filesystem.
const RESOLVED_PREFIX = '\0'

// One runtime for the whole plugin. `ManagedRuntime` builds its layer lazily on
// the first run, so declaring it here costs nothing until a module is generated.
const runtime = ManagedRuntime.make(CollectionsLive)

/**
 * A rendered document, loosely typed on purpose: the plugin only ever splits the
 * body off the frontmatter and serializes the rest generically, so naming each
 * collection's exact shape here would buy nothing.
 */
type Detail = Record<string, unknown> & { readonly html: string }

/**
 * The detail side of each collection that has pages. `directory` supplies the
 * slugs, `read` renders one document, `loader` is the accessor the generated map
 * is exported as. Reading goes through `packages/content`'s own readers, so the
 * schema, transform and body pipeline stay defined in one place.
 */
const DETAILS = {
  blogPosts: {
    directory: blogPostsCollection.directory,
    loader: 'loadBlogPost',
    read: (slug: string): Promise<Detail> =>
      runtime.runPromise(getBlogPost(slug)),
  },
  projects: {
    directory: projectsCollection.directory,
    loader: 'loadProject',
    read: (slug: string): Promise<Detail> =>
      runtime.runPromise(getProject(slug)),
  },
  talks: {
    directory: talksCollection.directory,
    loader: 'loadTalk',
    read: (slug: string): Promise<Detail> => runtime.runPromise(getTalk(slug)),
  },
} as const

type DetailCollection = keyof typeof DETAILS

/**
 * Frontmatter image fields arrive as `/content/<collection>/<slug>/<file>` — the
 * portable URL `collections.ts` derives. Anything matching becomes a real `?url`
 * import, so Vite hashes, emits and fingerprints the file, and an image nothing
 * references stays out of the bundle.
 */
const CONTENT_IMAGE = /^\/content\/.+\.(?:avif|gif|jpe?g|png|svg|webp)$/i

/** Srcs a browser already resolves correctly, so they must be left alone. */
const ABSOLUTE_SRC = /^(?:https?:|\/\/|\/|data:|#)/

type AssetRef = (publicUrl: string) => string | null

/**
 * Collects the asset imports a generated module needs, handing back the
 * identifier each is bound to. `header()` must run last, after every `ref()`
 * for that module.
 */
function createAssets() {
  const identifiers = new Map<string, string>()

  const ref: AssetRef = (publicUrl) => {
    const absolute = path.join(
      contentRoot,
      publicUrl.replace(/^\/content\//, ''),
    )
    // A missing file would otherwise fail the whole build over a typo in
    // frontmatter or a body image. Leave the original src in place and warn
    // instead — a broken image is not worth a red deploy.
    if (!fs.existsSync(absolute)) return null
    const existing = identifiers.get(absolute)
    if (existing) return existing
    const identifier = `__asset${identifiers.size}`
    identifiers.set(absolute, identifier)
    return identifier
  }

  const header = () =>
    Array.from(
      identifiers,
      ([absolute, identifier]) =>
        `import ${identifier} from ${JSON.stringify(`${absolute}?url`)}`,
    ).join('\n')

  return { ref, header }
}

/**
 * Serializes decoded frontmatter to a JS expression, swapping content image
 * paths for the identifier of their import. Hand-rolled rather than
 * `JSON.stringify` precisely because of that substitution — every schema field
 * decodes to a string, boolean, array or struct, so there is nothing else to
 * preserve.
 */
function serialize(value: unknown, ref: AssetRef): string {
  if (typeof value === 'string' && CONTENT_IMAGE.test(value)) {
    return ref(value) ?? JSON.stringify(value)
  }
  if (value === undefined) return 'null'
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) {
    return `[${value.map((entry) => serialize(entry, ref)).join(',')}]`
  }
  const fields = Object.entries(value)
    .filter(([, field]) => field !== undefined)
    .map(([key, field]) => `${JSON.stringify(key)}:${serialize(field, ref)}`)
  return `{${fields.join(',')}}`
}

/**
 * Rewrites the relative image srcs in a rendered body into asset imports,
 * yielding an expression that concatenates the untouched HTML around them.
 *
 * Body images are authored relative to the document (`![](./diagram.png)`), so
 * the raw HTML carries srcs a browser would resolve against the page URL. This
 * replaces the per-request regex the server function used to run.
 */
function serializeHtml(
  html: string,
  documentUrl: string,
  ref: AssetRef,
  warn: (message: string) => void,
): string {
  const chunks: string[] = []
  let cursor = 0

  for (const match of html.matchAll(/\bsrc="([^"]*)"/g)) {
    const src = match[1]
    if (src === undefined || ABSOLUTE_SRC.test(src)) continue

    const publicUrl = `${documentUrl}/${src.replace(/^\.\//, '')}`
    const identifier = ref(publicUrl)
    if (identifier === null) {
      warn(`image not found, left as-is: ${publicUrl}`)
      continue
    }

    // Splice around the attribute's value, keeping the surrounding markup —
    // the `src="` included — as an opaque literal.
    const valueStart = match.index + match[0].indexOf('"') + 1
    chunks.push(JSON.stringify(html.slice(cursor, valueStart)))
    chunks.push(identifier)
    cursor = valueStart + src.length
  }

  chunks.push(JSON.stringify(html.slice(cursor)))
  return chunks.join('+')
}

/**
 * Every slug on disk, unfiltered — drafts included. A directory per document is
 * what `Collections.getAll` treats as a slug, so reading them here agrees with
 * it while keeping the listing's `published` filter where it belongs: in the
 * reader. That is what lets an unpublished document keep a reachable page, as
 * reading per request allowed.
 */
const readSlugs = (directory: string) =>
  fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()

export function content(): Plugin {
  let warn: (message: string) => void = () => {}

  const loadIndex = async () => {
    const assets = createAssets()

    // Listed one by one rather than looped over: each reader has its own
    // document type, and iterating a table of them collapses that into a union
    // `runPromise` cannot resolve.
    const listings: ReadonlyArray<readonly [string, unknown]> = [
      ['blogPosts', await runtime.runPromise(getBlogPosts)],
      ['projects', await runtime.runPromise(getProjects)],
      ['experiences', await runtime.runPromise(getExperiences)],
      ['talks', await runtime.runPromise(getTalks)],
    ]

    const lines = listings.map(
      ([name, documents]) =>
        `export const ${name} = ${serialize(documents, assets.ref)}`,
    )

    for (const name of Object.keys(DETAILS) as DetailCollection[]) {
      const { directory, loader } = DETAILS[name]
      const entries = readSlugs(directory).map((slug) => {
        const id = `${DETAIL_PREFIX}${name}/${slug}`
        return `${JSON.stringify(slug)}:() => import(${JSON.stringify(id)})`
      })
      lines.push(`export const ${loader} = {${entries.join(',')}}`)
    }

    // `header()` last, once every `serialize` above has registered its assets.
    return [assets.header(), ...lines].filter(Boolean).join('\n')
  }

  const loadDetail = async (collection: DetailCollection, slug: string) => {
    const assets = createAssets()
    const { directory, read } = DETAILS[collection]
    const { html, ...data } = await read(slug)

    const documentUrl = `/content/${path.basename(directory)}/${slug}`
    const body = serializeHtml(html, documentUrl, assets.ref, warn)
    const frontmatter = serialize(data, assets.ref)

    // Both bound before `header()` runs: it can only import the assets that have
    // been referenced by then, and the hero lives in the frontmatter — computing
    // it inline below would register it one step too late.
    const header = assets.header()

    return [
      header,
      `export default Object.assign(${frontmatter}, { html: ${body} })`,
    ]
      .filter(Boolean)
      .join('\n')
  }

  return {
    name: 'ntatoud:content',
    // Ahead of Vite's own resolvers so `virtual:` ids are claimed here, and so
    // the `?url` imports this emits are still seen by the asset pipeline.
    enforce: 'pre',

    configResolved(config) {
      warn = (message) => config.logger.warn(`[content] ${message}`)
    },

    resolveId(id) {
      if (id === VIRTUAL_ID || id.startsWith(DETAIL_PREFIX)) {
        return RESOLVED_PREFIX + id
      }
      return null
    },

    load(id) {
      if (!id.startsWith(RESOLVED_PREFIX)) return null
      const virtual = id.slice(RESOLVED_PREFIX.length)

      if (virtual === VIRTUAL_ID) return loadIndex()

      if (virtual.startsWith(DETAIL_PREFIX)) {
        const [collection, slug] = virtual
          .slice(DETAIL_PREFIX.length)
          .split('/')
        if (collection && slug && collection in DETAILS) {
          return loadDetail(collection as DetailCollection, slug)
        }
      }

      return null
    },

    // Content sits outside the Vite root, so it is not watched by default.
    // Adding it keeps `pnpm dev` reflecting document edits immediately.
    configureServer(server) {
      server.watcher.add(contentRoot)

      server.watcher.on('all', (_event, changed) => {
        if (!changed.startsWith(contentRoot)) return

        // Drop every generated module: which document changed is not worth
        // tracking for a content set this size, and the listings depend on all
        // of them anyway.
        for (const [id, module_] of server.moduleGraph.idToModuleMap) {
          if (id.startsWith(RESOLVED_PREFIX + VIRTUAL_ID)) {
            server.moduleGraph.invalidateModule(module_)
          }
        }

        server.ws.send({ type: 'full-reload' })
      })
    },
  }
}
