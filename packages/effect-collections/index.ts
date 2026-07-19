import type { ComponentType } from 'react'

import { MdxCompiler, MdxCompilerLive } from '@ntatoud/effect-mdx'

import { NodeFileSystem, NodePath } from '@effect/platform-node'
import { Context, Effect, FileSystem, Layer, Path, Schema } from 'effect'

import { CollectionError } from './errors'
import { DocumentDirectory } from './image'

/** Curried `mapError` that tags a boundary failure with the operation that produced it. */
const collectionError =
  (operation: string) =>
  <A, E, R>(
    effect: Effect.Effect<A, E, R>,
  ): Effect.Effect<A, CollectionError, R> =>
    Effect.mapError(
      effect,
      (cause) => new CollectionError({ operation, cause }),
    )

export { CollectionError } from './errors'
export { DocumentDirectory, Image } from './image'
export type { ImageValue } from './image'

export interface CollectionMeta {
  readonly slug: string
  readonly directory: string
}

export interface Collection<S extends Schema.Constraint, A> {
  readonly name: string
  readonly directory: string
  readonly schema: S
  readonly transform: (
    data: S['Type'],
    meta: CollectionMeta,
  ) => Effect.Effect<A, CollectionError, FileSystem.FileSystem | Path.Path>
}

export function defineCollection<S extends Schema.Constraint, A>(collection: {
  readonly name: string
  readonly directory: string
  readonly schema: S
  readonly transform: (
    data: S['Type'],
    meta: CollectionMeta,
  ) => Effect.Effect<A, CollectionError, FileSystem.FileSystem | Path.Path>
}): Collection<S, A>
export function defineCollection<S extends Schema.Constraint>(collection: {
  readonly name: string
  readonly directory: string
  readonly schema: S
}): Collection<S, S['Type']>
export function defineCollection<S extends Schema.Constraint, A>(collection: {
  readonly name: string
  readonly directory: string
  readonly schema: S
  readonly transform?: (
    data: S['Type'],
    meta: CollectionMeta,
  ) => Effect.Effect<A, CollectionError, FileSystem.FileSystem | Path.Path>
}): Collection<S, A> {
  return {
    ...collection,
    transform: collection.transform ?? ((data) => Effect.succeed(data as A)),
  }
}

/**
 * A document without its compiled MDX body. `getAll` returns these: compiling
 * the body (MDX evaluation + Shiki highlighting) is by far the most expensive
 * step of reading a document, and list views only ever need the frontmatter.
 */
export interface DocumentMeta<A> {
  readonly slug: string
  readonly data: A
  readonly source: string
}

export interface Document<A> extends DocumentMeta<A> {
  readonly Content: ComponentType
}

// `DocumentDirectory` is always satisfied internally — `readDocument`
// provides it per-document before decoding — so it never leaks into what
// callers must provide, even though it shows up in a schema's raw
// `DecodingServices` for schemas using `Image` fields. `FileSystem`/`Path`
// remain part of the requirement: `CollectionsLive` provides them, but
// callers still provide that layer explicitly (same as `Collection.transform`
// implementations, which may also need them).
type ExternalDecodingServices<S extends Schema.Constraint> = Exclude<
  S['DecodingServices'],
  DocumentDirectory
>

export interface CollectionsShape {
  readonly getBySlug: <S extends Schema.Constraint, A>(
    collection: Collection<S, A>,
    slug: string,
  ) => Effect.Effect<
    Document<A>,
    CollectionError,
    FileSystem.FileSystem | Path.Path | ExternalDecodingServices<S>
  >
  readonly getAll: <S extends Schema.Constraint, A>(
    collection: Collection<S, A>,
  ) => Effect.Effect<
    ReadonlyArray<DocumentMeta<A>>,
    CollectionError,
    FileSystem.FileSystem | Path.Path | ExternalDecodingServices<S>
  >
}

export class Collections extends Context.Service<
  Collections,
  CollectionsShape
>()('effect-collections/Collections') {}

const make = Layer.effect(
  Collections,
  Effect.gen(function* () {
    const mdxCompiler = yield* MdxCompiler
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path

    const readSource = <S extends Schema.Constraint, A>(
      collection: Collection<S, A>,
      slug: string,
    ) =>
      fs
        .readFileString(path.join(collection.directory, slug, 'index.mdx'))
        .pipe(collectionError('readFile'))

    const decodeData = <S extends Schema.Constraint, A>(
      collection: Collection<S, A>,
      slug: string,
      frontmatter: Record<string, unknown>,
    ) =>
      Effect.gen(function* () {
        const decoded = yield* Schema.decodeUnknownEffect(collection.schema)(
          frontmatter,
        ).pipe(
          Effect.provideService(
            DocumentDirectory,
            path.join(collection.directory, slug),
          ),
          collectionError('decode'),
        )
        return yield* collection.transform(decoded, {
          slug,
          directory: collection.directory,
        })
      })

    const readDocument = <S extends Schema.Constraint, A>(
      collection: Collection<S, A>,
      slug: string,
    ) =>
      Effect.gen(function* () {
        const source = yield* readSource(collection, slug)
        const { frontmatter, Content } = yield* mdxCompiler
          .toJsx(source)
          .pipe(collectionError('toJsx'))
        const data = yield* decodeData(collection, slug, frontmatter)
        return { slug, data, source, Content } satisfies Document<A>
      })

    // Frontmatter-only read: skips MDX compilation, which list views never
    // need and which dominates the cost of `getAll` over a whole collection.
    const readDocumentMeta = <S extends Schema.Constraint, A>(
      collection: Collection<S, A>,
      slug: string,
    ) =>
      Effect.gen(function* () {
        const source = yield* readSource(collection, slug)
        const frontmatter = yield* mdxCompiler
          .frontmatter(source)
          .pipe(collectionError('frontmatter'))
        const data = yield* decodeData(collection, slug, frontmatter)
        return { slug, data, source } satisfies DocumentMeta<A>
      })

    return Collections.of({
      getBySlug: readDocument,
      getAll: (collection) =>
        Effect.gen(function* () {
          const names = yield* fs
            .readDirectory(collection.directory)
            .pipe(collectionError('readDirectory'))
          const slugs = yield* Effect.filter(names, (name) =>
            fs.stat(path.join(collection.directory, name)).pipe(
              Effect.map((info) => info.type === 'Directory'),
              Effect.orElseSucceed(() => false),
            ),
          )
          return yield* Effect.forEach(
            slugs,
            (slug) => readDocumentMeta(collection, slug),
            { concurrency: 8 },
          )
        }),
    })
  }),
)

export const CollectionsLive = make.pipe(
  Layer.provide(MdxCompilerLive),
  // Kept visible (provideMerge, not provide): `Collection.transform`
  // implementations may need FileSystem/Path themselves (e.g. to read a
  // hero image referenced in frontmatter).
  Layer.provideMerge(NodeFileSystem.layer),
  Layer.provideMerge(NodePath.layer),
)

// Schemas built from what this package ships (plain fields + `Image`) only
// ever need `DocumentDirectory | FileSystem.FileSystem | Path.Path` to
// decode — all three are provided by `CollectionsLive`. That's what lets
// `getAll`/`getBySlug` below run to `never` and return a plain `Promise`.
type KnownDecodingServices =
  | DocumentDirectory
  | FileSystem.FileSystem
  | Path.Path

/** Promise-based convenience wrapper — resolves `Collections` and provides `CollectionsLive` for you. */
export const getAll = <
  S extends Schema.Constraint & { DecodingServices: KnownDecodingServices },
  A,
>(
  collection: Collection<S, A>,
): Promise<ReadonlyArray<DocumentMeta<A>>> =>
  Effect.runPromise(
    // The `S['DecodingServices'] extends KnownDecodingServices` constraint
    // above guarantees this is sound; tsc just can't distribute `Exclude`
    // over a constrained indexed-access type parameter to verify it itself.
    Collections.use((collections) => collections.getAll(collection)).pipe(
      Effect.provide(CollectionsLive),
    ) as Effect.Effect<ReadonlyArray<DocumentMeta<A>>, CollectionError>,
  )

/** Promise-based convenience wrapper — resolves `Collections` and provides `CollectionsLive` for you. */
export const getBySlug = <
  S extends Schema.Constraint & { DecodingServices: KnownDecodingServices },
  A,
>(
  collection: Collection<S, A>,
  slug: string,
): Promise<Document<A>> =>
  Effect.runPromise(
    Collections.use((collections) =>
      collections.getBySlug(collection, slug),
    ).pipe(Effect.provide(CollectionsLive)) as Effect.Effect<
      Document<A>,
      CollectionError
    >,
  )
