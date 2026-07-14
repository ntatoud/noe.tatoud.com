import { Effect, FileSystem, Path } from 'effect'
import { imageSize } from 'image-size'

import { CollectionsConfig } from '#core/config'

export type ResolvedImage = {
  readonly src: string
  readonly width: number | null
  readonly height: number | null
}

export const isRelativeRef = (ref: string): boolean =>
  !/^[a-z][a-z0-9+.-]*:/i.test(ref) && !ref.startsWith('/')

const stripLeading = (ref: string): string =>
  ref.replace(/^\.\//, '').replace(/^\/+/, '')

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
