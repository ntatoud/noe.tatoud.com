import { Data, Effect, FileSystem, Path, Schema, SchemaGetter } from 'effect'

import { CollectionsConfig } from '#core/config'
import { resolveImage, resolveLogo, type ResolvedImage } from '#core/image'

export class ImageRef extends Data.TaggedClass('ImageRef')<{
  readonly ref: string
  readonly kind: 'asset' | 'inline'
}> {}

const imageRefSchema = Schema.instanceOf(ImageRef)

export const Image = Schema.String.pipe(
  Schema.decodeTo(imageRefSchema, {
    decode: SchemaGetter.transform(
      (ref: string) => new ImageRef({ ref, kind: 'asset' }),
    ),
    encode: SchemaGetter.transform((image: ImageRef) => image.ref),
  }),
)

export const Logo = Schema.String.pipe(
  Schema.decodeTo(imageRefSchema, {
    decode: SchemaGetter.transform(
      (ref: string) => new ImageRef({ ref, kind: 'inline' }),
    ),
    encode: SchemaGetter.transform((image: ImageRef) => image.ref),
  }),
)

export type ResolveImageRefs<T> = T extends ImageRef
  ? ResolvedImage
  : T extends ReadonlyArray<infer U>
    ? ReadonlyArray<ResolveImageRefs<U>>
    : T extends object
      ? { readonly [K in keyof T]: ResolveImageRefs<T[K]> }
      : T

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
