import * as fs from 'node:fs'

import type { Plugin } from 'vite'

import { contentFilePath, contentRoot, contentUrl } from './content-url.ts'
import { bodyImageUrl } from './markdown.ts'
import { contentInventoryOf } from './pages.ts'
import {
  collectionsOf,
  readContent,
  renderBody,
  type ContentSnapshot,
} from './snapshot.ts'

const VIRTUAL_ID = 'virtual:content'
const DETAIL_PREFIX = `${VIRTUAL_ID}/detail/`

// Rollup convention: NUL-prefixed ids mark modules with no file on disk.
const RESOLVED_PREFIX = '\0'

const IMAGE_EXTENSION = /\.(?:avif|gif|jpe?g|png|svg|webp)$/i

type AssetRef = (publicUrl: string) => string | null

function createAssets() {
  const identifiers = new Map<string, string>()

  const ref: AssetRef = (publicUrl) => {
    const absolute = contentFilePath(publicUrl)
    // A missing image warns instead of failing the build.
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

// Not `JSON.stringify`: image paths are swapped for the identifier of their import.
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

  // One read per build; in dev the watcher below drops it.
  let snapshot: Promise<ContentSnapshot> | undefined
  const getSnapshot = () => (snapshot ??= readContent())

  const loadIndex = async () => {
    const assets = createAssets()
    const content = await getSnapshot()
    const collections = collectionsOf(content)

    const lines = collections.map(
      ({ key, listing }) =>
        `export const ${key} = ${serialize(listing, assets.ref)}`,
    )

    // Every document gets a page, drafts included; only the listings filter on `published`.
    for (const { key, detail } of collections) {
      if (!detail) continue
      const entries = detail.documents.map(({ slug }) => {
        const id = `${DETAIL_PREFIX}${key}/${slug}`
        return `${JSON.stringify(slug)}:() => import(${JSON.stringify(id)})`
      })
      lines.push(`export const ${detail.loader} = {${entries.join(',')}}`)
    }

    lines.push(
      `export const contentInventory = ${JSON.stringify(contentInventoryOf(content))}`,
    )

    return assets.emit(...lines)
  }

  const loadDetail = async (key: string, slug: string) => {
    const collection = collectionsOf(await getSnapshot()).find(
      (candidate) => candidate.key === key,
    )
    if (!collection?.detail) return null

    const document = collection.detail.documents.find(
      (candidate) => candidate.slug === slug,
    )
    if (!document) {
      throw new Error(`[content] no ${key} document with slug "${slug}"`)
    }

    const assets = createAssets()
    const html = await renderBody(document.source)
    const body = serializeHtml(
      html,
      contentUrl(collection.directory, slug),
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
    // Ahead of Vite's resolvers so `virtual:` ids are claimed here and `?url` imports reach the asset pipeline.
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
        if (collection && slug) return loadDetail(collection, slug)
      }

      return null
    },

    // Content sits outside the Vite root, so it is not watched by default.
    configureServer(server) {
      server.watcher.add(contentRoot)

      server.watcher.on('all', (_event, changed) => {
        if (!changed.startsWith(contentRoot)) return
        snapshot = undefined

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
