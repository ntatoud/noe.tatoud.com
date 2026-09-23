import * as fs from 'node:fs'

import type { Plugin } from 'vite'

import {
  blogPosts as blogPostsCollection,
  caseStudies as caseStudiesCollection,
  contentFilePath,
  contentRoot,
  contentUrl,
  projects as projectsCollection,
  talks as talksCollection,
} from './collections.ts'
import { bodyImageUrl } from './markdown.ts'
import { readContent, renderBody, type ContentSnapshot } from './snapshot.ts'

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

/**
 * The detail side of each collection that has pages. `directory` locates the
 * document's images, `loader` is the accessor the generated map is exported as.
 * Slugs and data come from the content snapshot.
 */
const DETAILS = {
  blogPosts: {
    directory: blogPostsCollection.directory,
    loader: 'loadBlogPost',
  },
  projects: {
    directory: projectsCollection.directory,
    loader: 'loadProject',
  },
  caseStudies: {
    directory: caseStudiesCollection.directory,
    loader: 'loadCaseStudy',
  },
  talks: {
    directory: talksCollection.directory,
    loader: 'loadTalk',
  },
} as const

const LISTINGS = [
  'blogPosts',
  'projects',
  'caseStudies',
  'experiences',
  'talks',
] as const

type DetailCollection = keyof typeof DETAILS

/**
 * Image extensions worth turning into a real `?url` import, so Vite hashes,
 * emits and fingerprints the file — and so an image nothing references stays out
 * of the bundle. A string that merely looks like an image but is not a content
 * URL (an external `logo` on a talk event, say) is rejected by `ref` below.
 */
const IMAGE_EXTENSION = /\.(?:avif|gif|jpe?g|png|svg|webp)$/i

type AssetRef = (publicUrl: string) => string | null

/**
 * Collects the asset imports a generated module needs.
 *
 * `emit` is the only way out: it prepends the imports for everything `ref`
 * registered, so the imports cannot be generated before the code that
 * references them. That ordering used to be the caller's job, and getting it
 * wrong produced a `ReferenceError` inside a generated module — see the test.
 */
function createAssets() {
  const identifiers = new Map<string, string>()

  const ref: AssetRef = (publicUrl) => {
    const absolute = contentFilePath(publicUrl)
    // A missing file would otherwise fail the whole build over a typo in
    // frontmatter or a body image. Leave the original src in place and warn
    // instead — a broken image is not worth a red deploy.
    if (!absolute || !fs.existsSync(absolute)) return null
    const existing = identifiers.get(absolute)
    if (existing) return existing
    const identifier = `__asset${identifiers.size}`
    identifiers.set(absolute, identifier)
    return identifier
  }

  const emit = (...lines: ReadonlyArray<string>) =>
    [
      ...Array.from(
        identifiers,
        ([absolute, identifier]) =>
          `import ${identifier} from ${JSON.stringify(`${absolute}?url`)}`,
      ),
      ...lines,
    ].join('\n')

  return { ref, emit }
}

/**
 * Serializes decoded frontmatter to a JS expression, swapping content image
 * paths for the identifier of their import. Hand-rolled rather than
 * `JSON.stringify` precisely because of that substitution — every schema field
 * decodes to a string, boolean, array or struct, so there is nothing else to
 * preserve.
 */
function serialize(value: unknown, ref: AssetRef): string {
  if (typeof value === 'string' && IMAGE_EXTENSION.test(value)) {
    return ref(value) ?? JSON.stringify(value)
  }
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
    if (src === undefined) continue
    const publicUrl = bodyImageUrl(documentUrl, src)
    if (publicUrl === null) continue

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

export function content(): Plugin {
  let warn: (message: string) => void = () => {}

  // One read per build. In dev the watcher below drops it, so an edit is
  // picked up by the next module load.
  let snapshot: Promise<ContentSnapshot> | undefined
  const getSnapshot = () => (snapshot ??= readContent())

  const loadIndex = async () => {
    const assets = createAssets()
    const current = await getSnapshot()

    const lines = LISTINGS.map(
      (name) =>
        `export const ${name} = ${serialize(current[name], assets.ref)}`,
    )

    // Every document gets a page, drafts included; only the listings above
    // apply the `published` filter.
    for (const [name, { loader }] of Object.entries(DETAILS)) {
      const entries = current.documents[name as DetailCollection].map(
        ({ slug }) => {
          const id = `${DETAIL_PREFIX}${name}/${slug}`
          return `${JSON.stringify(slug)}:() => import(${JSON.stringify(id)})`
        },
      )
      lines.push(`export const ${loader} = {${entries.join(',')}}`)
    }

    return assets.emit(...lines)
  }

  const loadDetail = async (collection: DetailCollection, slug: string) => {
    const document = (await getSnapshot()).documents[collection].find(
      (candidate) => candidate.slug === slug,
    )
    if (!document) {
      throw new Error(`[content] no ${collection} document with slug "${slug}"`)
    }

    const assets = createAssets()
    const html = await renderBody(document.source)
    const body = serializeHtml(
      html,
      contentUrl(DETAILS[collection].directory, slug),
      assets.ref,
      warn,
    )
    const frontmatter = serialize(document.data, assets.ref)

    return assets.emit(
      `export default Object.assign(${frontmatter}, { html: ${body} })`,
    )
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
        snapshot = undefined

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
