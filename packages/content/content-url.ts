import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { CollectionMeta, ImageValue } from '@ntatoud/effect-collections'

const here = path.dirname(fileURLToPath(import.meta.url))

// The repo-root `content/` folder. This module only ever runs from source,
// inside the Vite plugins and their tests, so its own location is reliable.
export const contentRoot = path.resolve(here, '../../content')

const CONTENT_URL_BASE = '/content'

/**
 * The public URL of something inside `content/`:
 * `/content/<collection>/<slug>[/<file>]`.
 *
 * This scheme and its inverse below are the seam between the collections and the
 * Vite plugin, which turns such a URL back into a path on disk to import as a
 * hashed asset. Both directions live here so the `/content` prefix is written in
 * exactly one place: a mismatch would not fail loudly, it would degrade into
 * "image not found" warnings and unbundled images.
 */
export const contentUrl = (
  collectionDirectory: string,
  ...segments: ReadonlyArray<string>
) =>
  [CONTENT_URL_BASE, path.basename(collectionDirectory), ...segments].join('/')

/** Inverse of `contentUrl`: the file on disk it points at, or `null`. */
export const contentFilePath = (url: string): string | null =>
  url.startsWith(`${CONTENT_URL_BASE}/`)
    ? path.join(contentRoot, url.slice(CONTENT_URL_BASE.length + 1))
    : null

/**
 * `Image` decodes a frontmatter path into an absolute filesystem path, which is
 * meaningless to a browser. Every collection carrying an image derives a
 * portable URL through this, once, rather than in its Reader. Separators are
 * forced to `/` so the value stays a URL on Windows, where `path.relative`
 * returns backslashes.
 */
export const publicImageUrl = (image: ImageValue, meta: CollectionMeta) =>
  contentUrl(
    meta.directory,
    path.relative(meta.directory, image.path).split(path.sep).join('/'),
  )
