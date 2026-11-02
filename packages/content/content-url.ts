import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { CollectionMeta, ImageValue } from '@ntatoud/effect-collections'

const here = path.dirname(fileURLToPath(import.meta.url))

// Only ever runs from source (Vite plugins and tests), so this file's location is reliable.
export const contentRoot = path.resolve(here, '../../content')

const CONTENT_URL_BASE = '/content'

// Both directions live here so the `/content` prefix is written once; a mismatch silently leaves images unbundled.
export const contentUrl = (
  collectionDirectory: string,
  ...segments: ReadonlyArray<string>
) =>
  [CONTENT_URL_BASE, path.basename(collectionDirectory), ...segments].join('/')

export const contentFilePath = (url: string): string | null =>
  url.startsWith(`${CONTENT_URL_BASE}/`)
    ? path.join(contentRoot, url.slice(CONTENT_URL_BASE.length + 1))
    : null

// Forces `/` separators so the URL stays valid on Windows.
export const publicImageUrl = (image: ImageValue, meta: CollectionMeta) =>
  contentUrl(
    meta.directory,
    path.relative(meta.directory, image.path).split(path.sep).join('/'),
  )
