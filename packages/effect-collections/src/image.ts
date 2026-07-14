import { Effect, FileSystem, Path } from 'effect'
import { imageSize } from 'image-size'

import { CollectionsConfig } from '#core/config'

/**
 * A resolved image reference: a public/inlined source URL plus its stamped
 * dimensions. Produced both by the low-level {@link resolveImage}/
 * {@link resolveLogo} helpers and by the reader's automatic `ImageRef`
 * resolution.
 */
export type ResolvedImage = {
  readonly src: string
  readonly width: number | null
  readonly height: number | null
}

/**
 * Whether a reference points inside the Document's directory (so the pipeline
 * owns it) rather than at an absolute URL, a root-absolute path, or a data URL.
 */
export const isRelativeRef = (ref: string): boolean =>
  !/^[a-z][a-z0-9+.-]*:/i.test(ref) && !ref.startsWith('/')

const stripLeading = (ref: string): string =>
  ref.replace(/^\.\//, '').replace(/^\/+/, '')

/**
 * Builds the public URL for a reference colocated with a Document:
 * `<assetBaseUrl>/<collection>/<slug>/<file>`. The base's scheme (if any) is
 * preserved — only duplicate path separators are collapsed.
 */
export const assetUrl = (
  assetBaseUrl: string,
  collection: string,
  slug: string,
  ref: string,
): string => {
  const base = assetBaseUrl.replace(/\/+$/, '')
  return `${base}/${collection}/${slug}/${stripLeading(ref)}`
}

const MIME_BY_EXT: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
}

const mimeFor = (ext: string): string =>
  MIME_BY_EXT[ext.toLowerCase()] ?? 'application/octet-stream'

/**
 * Resolves an image reference relative to a Document's directory to a stable
 * `<assetBaseUrl>/<collection>/<slug>/<path>` URL and stamps its on-disk
 * dimensions. A reference that cannot be read still yields the URL with null
 * dimensions.
 *
 * Platform access goes through the Effect `FileSystem`/`Path` services, so the
 * engine stays framework-agnostic — the runner decides which platform Layer
 * (e.g. `NodeServices.layer`) satisfies them.
 */
export const resolveImage = (
  collection: string,
  slug: string,
  ref: string,
): Effect.Effect<
  ResolvedImage,
  never,
  CollectionsConfig | FileSystem.FileSystem | Path.Path
> =>
  Effect.gen(function* () {
    const { contentRoot, assetBaseUrl } = yield* CollectionsConfig
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path

    const src = assetUrl(assetBaseUrl, collection, slug, ref)
    const filePath = path.join(contentRoot, collection, slug, stripLeading(ref))

    return yield* fs.readFile(filePath).pipe(
      Effect.map((buffer) => {
        const size = imageSize(buffer)
        return {
          src,
          width: size.width ?? null,
          height: size.height ?? null,
        }
      }),
      Effect.orElseSucceed(
        (): ResolvedImage => ({ src, width: null, height: null }),
      ),
    )
  })

/**
 * Resolves a (tiny) logo reference to an inlined base64 `data:` URL with stamped
 * dimensions — keeping it out of a request round-trip. A reference that cannot
 * be read yields an empty `src` with null dimensions.
 */
export const resolveLogo = (
  collection: string,
  slug: string,
  ref: string,
): Effect.Effect<
  ResolvedImage,
  never,
  CollectionsConfig | FileSystem.FileSystem | Path.Path
> =>
  Effect.gen(function* () {
    const { contentRoot } = yield* CollectionsConfig
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path

    const cleaned = stripLeading(ref)
    const filePath = path.join(contentRoot, collection, slug, cleaned)

    return yield* fs.readFile(filePath).pipe(
      Effect.map((buffer) => {
        const size = imageSize(buffer)
        const mime = mimeFor(path.extname(cleaned))
        const base64 = Buffer.from(buffer).toString('base64')
        return {
          src: `data:${mime};base64,${base64}`,
          width: size.width ?? null,
          height: size.height ?? null,
        }
      }),
      Effect.orElseSucceed(
        (): ResolvedImage => ({ src: '', width: null, height: null }),
      ),
    )
  })

/** Whether a reference resolves to a file that exists on disk. */
export const imageRefExists = (
  collection: string,
  slug: string,
  ref: string,
): Effect.Effect<
  boolean,
  never,
  CollectionsConfig | FileSystem.FileSystem | Path.Path
> =>
  Effect.gen(function* () {
    const { contentRoot } = yield* CollectionsConfig
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path
    const filePath = path.join(contentRoot, collection, slug, stripLeading(ref))
    return yield* fs.exists(filePath).pipe(Effect.orElseSucceed(() => false))
  })
