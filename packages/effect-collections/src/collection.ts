import { Effect, FileSystem, Path, Schema } from 'effect'

import { CollectionsConfig } from '#core/config'
import {
  CompileFailed,
  ContentNotFound,
  FrontmatterInvalid,
} from '#core/errors'
import { HighlighterService } from '#core/highlighter'
import { type ResolveImageRefs, resolveImageRefs } from '#core/image-schema'
import { compileMdxBody } from '#core/mdx'
import { documentMtime, listSlugs, readDocument } from '#core/source'

export type CollectionDeps =
  | CollectionsConfig
  | HighlighterService
  | FileSystem.FileSystem
  | Path.Path

type ResolveDeps = CollectionsConfig | FileSystem.FileSystem | Path.Path

export type FrontmatterSchema = Schema.Top & {
  readonly DecodingServices: never
  readonly EncodingServices: never
}

export type ResolvedFrontmatter<S extends FrontmatterSchema> = ResolveImageRefs<
  S['Type']
>

export type DefaultMeta<S extends FrontmatterSchema> =
  ResolvedFrontmatter<S> & {
    readonly slug: string
    readonly url: string
  }

export type ToMetadataArgs<F> = {
  readonly slug: string
  readonly url: string
  readonly frontmatter: F
}

export type Collection<S extends FrontmatterSchema, Meta extends object> = {
  readonly name: string
  readonly schema: S
  readonly toMetadata?: (
    args: ToMetadataArgs<ResolvedFrontmatter<S>>,
  ) => Effect.Effect<Meta, never, ResolveDeps>
  readonly include?: (meta: Meta) => boolean
  readonly order?: (a: Meta, b: Meta) => number
}

export function defineCollection<
  S extends FrontmatterSchema,
  Meta extends object,
>(def: {
  readonly name: string
  readonly schema: S
  readonly toMetadata: (
    args: ToMetadataArgs<ResolvedFrontmatter<S>>,
  ) => Effect.Effect<Meta, never, ResolveDeps>
  readonly include?: (meta: Meta) => boolean
  readonly order?: (a: Meta, b: Meta) => number
}): Collection<S, Meta>
export function defineCollection<S extends FrontmatterSchema>(def: {
  readonly name: string
  readonly schema: S
  readonly include?: (meta: DefaultMeta<S>) => boolean
  readonly order?: (a: DefaultMeta<S>, b: DefaultMeta<S>) => number
}): Collection<S, DefaultMeta<S>>
export function defineCollection(def: unknown): unknown {
  return def
}

export type Readers<Meta extends object> = {
  readonly list: Effect.Effect<
    ReadonlyArray<Meta>,
    ContentNotFound | FrontmatterInvalid,
    CollectionDeps
  >
  readonly get: (
    slug: string,
  ) => Effect.Effect<
    Meta & { body: string },
    ContentNotFound | FrontmatterInvalid | CompileFailed,
    CollectionDeps
  >
}

export const makeReaders = <S extends FrontmatterSchema, Meta extends object>(
  collection: Collection<S, Meta>,
): Readers<Meta> => {
  const name = collection.name
  const toMetadata = collection.toMetadata
  const include = collection.include
  const order = collection.order
  const compiledCache = new Map<string, string>()

  const validate = (
    slug: string,
    data: unknown,
  ): Effect.Effect<S['Type'], FrontmatterInvalid> =>
    Schema.decodeUnknownEffect(collection.schema)(data).pipe(
      Effect.mapError(
        (error) =>
          new FrontmatterInvalid({
            collection: name,
            slug,
            reason: error.message,
          }),
      ),
    )

  const buildMeta = (
    slug: string,
    frontmatter: S['Type'],
  ): Effect.Effect<Meta, never, ResolveDeps> =>
    Effect.gen(function* () {
      const resolved = yield* resolveImageRefs(name, slug, frontmatter)
      const url = `/${name}/${slug}`
      if (toMetadata) {
        return yield* toMetadata({ slug, url, frontmatter: resolved })
      }
      return {
        ...(resolved as Record<string, unknown>),
        slug,
        url,
      } as unknown as Meta
    })

  const list = Effect.gen(function* () {
    const slugs = yield* listSlugs(name)
    const metas = yield* Effect.forEach(slugs, (slug) =>
      readDocument(name, slug).pipe(
        Effect.flatMap(({ data }) => validate(slug, data)),
        Effect.flatMap((frontmatter) => buildMeta(slug, frontmatter)),
      ),
    )
    const included = include ? metas.filter((meta) => include(meta)) : metas
    return order ? [...included].sort(order) : included
  })

  const get = (slug: string) =>
    Effect.gen(function* () {
      const { assetBaseUrl } = yield* CollectionsConfig
      const { data, body, file } = yield* readDocument(name, slug)
      const frontmatter = yield* validate(slug, data)
      const meta = yield* buildMeta(slug, frontmatter)
      const { highlighter, theme } = yield* HighlighterService
      const mtime = yield* documentMtime(file)

      const cacheKey = `${slug}:${mtime}`
      let compiled = compiledCache.get(cacheKey)
      if (compiled === undefined) {
        compiled = yield* compileMdxBody({
          collection: name,
          slug,
          source: body,
          highlighter,
          theme,
          assetBaseUrl,
        })
        compiledCache.set(cacheKey, compiled)
      }
      return { ...meta, body: compiled }
    })

  return { list, get }
}

export type MetaOf<C extends Collection<any, any>> =
  C extends Collection<any, infer Meta> ? Meta : never

export type CollectionAccessor<Meta extends object> = {
  readonly list: () => Effect.Effect<
    ReadonlyArray<Meta>,
    ContentNotFound | FrontmatterInvalid
  >
  readonly get: (
    slug: string,
  ) => Effect.Effect<
    Meta & { body: string },
    ContentNotFound | FrontmatterInvalid | CompileFailed
  >
}

export const makeCollections = <R extends Record<string, Collection<any, any>>>(
  collections: R,
): Effect.Effect<
  { readonly [K in keyof R]: CollectionAccessor<MetaOf<R[K]>> },
  never,
  CollectionDeps
> =>
  Effect.gen(function* () {
    const context = yield* Effect.context<CollectionDeps>()

    const accessors: Record<string, CollectionAccessor<object>> = {}
    for (const [key, collection] of Object.entries(collections)) {
      const readers = makeReaders(collection)
      accessors[key] = {
        list: () => readers.list.pipe(Effect.provide(context)),
        get: (slug) => readers.get(slug).pipe(Effect.provide(context)),
      }
    }

    return accessors as {
      readonly [K in keyof R]: CollectionAccessor<MetaOf<R[K]>>
    }
  })
