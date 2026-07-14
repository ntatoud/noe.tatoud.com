import { FileSystem, Path } from '@effect/platform'
import { Effect } from 'effect'
import { imageSize } from 'image-size'

export type ResolvedImage = {
  readonly url: string
  readonly width: number | null
  readonly height: number | null
}

export type ResolvedLogo = {
  readonly dataUrl: string
  readonly width: number | null
  readonly height: number | null
}

/**
 * External URLs, root-relative paths, and data URIs are not local file
 * references — shared by the MDX body image rewriter (`rehypeContentImages`)
 * and the build-time content validator's image-existence check.
 */
export const isRelativeRef = (src: string) =>
  !/^([a-z][a-z0-9+.-]*:|\/\/|\/)/i.test(src)

/**
 * Resolves an image reference relative to a Document's directory to a stable
 * `/content/<collection>/<slug>/<path>` URL and stamps its on-disk dimensions.
 * A reference that cannot be read still yields the URL with null dimensions.
 *
 * Platform access goes through the Effect `FileSystem`/`Path` services, so the
 * engine stays framework-agnostic — the runner decides which platform Layer
 * (e.g. `NodeContext.layer`) satisfies them.
 */
export const resolveImage = (
  contentRoot: string,
  collection: string,
  slug: string,
  ref: string,
): Effect.Effect<ResolvedImage, never, FileSystem.FileSystem | Path.Path> =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path

    const cleaned = ref.replace(/^\.\//, '')
    const url = `/content/${collection}/${slug}/${cleaned}`.replace(
      /\/{2,}/g,
      '/',
    )
    const filePath = path.join(contentRoot, collection, slug, cleaned)

    return yield* fs.readFile(filePath).pipe(
      Effect.map((buffer) => {
        const size = imageSize(buffer)
        return {
          url,
          width: size.width ?? null,
          height: size.height ?? null,
        }
      }),
      Effect.orElseSucceed(
        (): ResolvedImage => ({ url, width: null, height: null }),
      ),
    )
  })

const mimeTypeFor = (ext: string): string =>
  ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`

/**
 * Resolves a logo frontmatter reference relative to a Document's directory
 * to a base64 data-URL, stamping its on-disk dimensions. Unlike
 * {@link resolveImage}, tiny logos are inlined rather than served from
 * `/content` (ADR-0008), so a reference that cannot be read yields `null`
 * outright — there is no stable URL to fall back to.
 */
export const resolveLogo = (
  contentRoot: string,
  collection: string,
  slug: string,
  ref: string,
): Effect.Effect<
  ResolvedLogo | null,
  never,
  FileSystem.FileSystem | Path.Path
> =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path

    const cleaned = ref.replace(/^\.\//, '')
    const filePath = path.join(contentRoot, collection, slug, cleaned)
    const ext = path.extname(cleaned).slice(1).toLowerCase()

    return yield* fs.readFile(filePath).pipe(
      Effect.map((buffer): ResolvedLogo => {
        const size = imageSize(buffer)
        return {
          dataUrl: `data:${mimeTypeFor(ext)};base64,${Buffer.from(buffer).toString('base64')}`,
          width: size.width ?? null,
          height: size.height ?? null,
        }
      }),
      Effect.orElseSucceed((): ResolvedLogo | null => null),
    )
  })

/**
 * Checks whether an image reference relative to a Document's directory exists
 * on disk, without reading or decoding it — the build-time counterpart to
 * {@link resolveImage}/{@link resolveLogo}, which both swallow a missing file
 * into a still-successful (if dimension-less) result so request-time rendering
 * never breaks on a bad ref. This is the strict check the content validator
 * uses to fail the build instead. Existence goes through the Effect
 * `FileSystem` service (`fs.exists`), consistent with the rest of the engine.
 */
export const imageRefExists = (
  contentRoot: string,
  collection: string,
  slug: string,
  ref: string,
): Effect.Effect<boolean, never, FileSystem.FileSystem | Path.Path> =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path

    const cleaned = ref.replace(/^\.\//, '')
    const filePath = path.join(contentRoot, collection, slug, cleaned)

    return yield* fs.exists(filePath).pipe(Effect.orElseSucceed(() => false))
  })
