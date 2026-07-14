import { Data, Effect, FileSystem, Path, Schema, SchemaGetter } from 'effect'

import { CollectionsConfig } from '#core/config'
import { resolveImage, resolveLogo, type ResolvedImage } from '#core/image'

/**
 * The decoded form of an image field: a tagged marker carrying the raw
 * frontmatter reference and how it should be resolved. `ImageRef`s are produced
 * when frontmatter is decoded and are replaced by {@link ResolvedImage}s during
 * reader metadata assembly — they never leak into a collection's public
 * metadata.
 *
 * - `asset` — resolved to a public `<assetBaseUrl>/…` URL.
 * - `inline` — resolved to a base64 `data:` URL (small logos).
 */
export class ImageRef extends Data.TaggedClass('ImageRef')<{
  readonly ref: string
  readonly kind: 'asset' | 'inline'
}> {}

const imageRefSchema = Schema.instanceOf(ImageRef)

/**
 * A frontmatter image field. Its Encoded form is the raw `string` reference the
 * author writes (`hero: ./hero.png`); its decoded Type is an {@link ImageRef}
 * (`kind: 'asset'`) that the reader later resolves to a public
 * `<assetBaseUrl>/<collection>/<slug>/<file>` URL with stamped dimensions.
 *
 * Composes with optionality/nullability, e.g. `Schema.optional(Image)`.
 */
export const Image = Schema.String.pipe(
  Schema.decodeTo(imageRefSchema, {
    decode: SchemaGetter.transform(
      (ref: string) => new ImageRef({ ref, kind: 'asset' }),
    ),
    encode: SchemaGetter.transform((image: ImageRef) => image.ref),
  }),
)

/**
 * Like {@link Image}, but decodes to an {@link ImageRef} with `kind: 'inline'`
 * — the reader resolves it to an inlined base64 `data:` URL. Suitable for small
 * logos that should avoid an extra request round-trip.
 */
export const Logo = Schema.String.pipe(
  Schema.decodeTo(imageRefSchema, {
    decode: SchemaGetter.transform(
      (ref: string) => new ImageRef({ ref, kind: 'inline' }),
    ),
    encode: SchemaGetter.transform((image: ImageRef) => image.ref),
  }),
)

/**
 * Maps a decoded frontmatter type to its resolved form: every {@link ImageRef}
 * (however deeply nested inside arrays/objects) becomes a {@link ResolvedImage},
 * distributing over unions so `ImageRef | undefined` becomes
 * `ResolvedImage | undefined`. Everything else is preserved.
 */
export type ResolveImageRefs<T> = T extends ImageRef
  ? ResolvedImage
  : T extends ReadonlyArray<infer U>
    ? ReadonlyArray<ResolveImageRefs<U>>
    : T extends object
      ? { readonly [K in keyof T]: ResolveImageRefs<T[K]> }
      : T

/** Services the `ImageRef` resolution walk needs at run time. */
type ResolveDeps = CollectionsConfig | FileSystem.FileSystem | Path.Path

const isPlainObject = (value: object): boolean => {
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

const resolveRef = (
  collection: string,
  slug: string,
  ref: ImageRef,
): Effect.Effect<ResolvedImage, never, ResolveDeps> =>
  ref.kind === 'inline'
    ? resolveLogo(collection, slug, ref.ref)
    : resolveImage(collection, slug, ref.ref)

const walk = (
  collection: string,
  slug: string,
  value: unknown,
): Effect.Effect<unknown, never, ResolveDeps> => {
  if (value instanceof ImageRef) return resolveRef(collection, slug, value)
  if (Array.isArray(value)) {
    return Effect.forEach(value, (item) => walk(collection, slug, item))
  }
  if (value !== null && typeof value === 'object' && isPlainObject(value)) {
    const entries = Object.entries(value as Record<string, unknown>)
    return Effect.map(
      Effect.forEach(entries, ([key, item]) =>
        Effect.map(
          walk(collection, slug, item),
          (resolved) => [key, resolved] as const,
        ),
      ),
      (pairs) => Object.fromEntries(pairs),
    )
  }
  return Effect.succeed(value)
}

/**
 * Recursively resolves every {@link ImageRef} in a decoded frontmatter value to
 * a {@link ResolvedImage}, walking arrays and (plain) nested objects. Absent
 * optional images (`undefined`/`null`) and every non-image value are preserved.
 */
export const resolveImageRefs = <T>(
  collection: string,
  slug: string,
  value: T,
): Effect.Effect<ResolveImageRefs<T>, never, ResolveDeps> =>
  walk(collection, slug, value) as Effect.Effect<
    ResolveImageRefs<T>,
    never,
    ResolveDeps
  >
