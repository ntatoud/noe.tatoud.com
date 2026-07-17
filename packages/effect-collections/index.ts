import type { ComponentType } from 'react'

import { MdxCompiler, MdxCompilerLive } from '@ntatoud/effect-mdx'

import { NodeFileSystem, NodePath } from '@effect/platform-node'
import { Context, Effect, FileSystem, Layer, Path, Schema } from 'effect'

import { CollectionError } from './errors'
import { DocumentDirectory } from './image'

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

export interface Document<A> {
  readonly slug: string
  readonly data: A
  readonly source: string
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
    ReadonlyArray<Document<A>>,
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

    const readDocument = <S extends Schema.Constraint, A>(
      collection: Collection<S, A>,
      slug: string,
    ) =>
      Effect.gen(function* () {
        const filePath = path.join(collection.directory, slug, 'index.mdx')
        const source = yield* fs
          .readFileString(filePath)
          .pipe(
            Effect.mapError(
              (cause) => new CollectionError({ operation: 'readFile', cause }),
            ),
          )
        const { frontmatter, Content } = yield* mdxCompiler
          .toJsx(source)
          .pipe(
            Effect.mapError(
              (cause) => new CollectionError({ operation: 'toJsx', cause }),
            ),
          )
        const decoded = yield* Schema.decodeUnknownEffect(collection.schema)(
          frontmatter,
        ).pipe(
          Effect.provideService(
            DocumentDirectory,
            path.join(collection.directory, slug),
          ),
          Effect.mapError(
            (cause) => new CollectionError({ operation: 'decode', cause }),
          ),
        )
        const data = yield* collection.transform(decoded, {
          slug,
          directory: collection.directory,
        })
        return { slug, data, source, Content } satisfies Document<A>
      })

    return Collections.of({
      getBySlug: readDocument,
      getAll: (collection) =>
        Effect.gen(function* () {
          const names = yield* fs
            .readDirectory(collection.directory)
            .pipe(
              Effect.mapError(
                (cause) =>
                  new CollectionError({ operation: 'readDirectory', cause }),
              ),
            )
          const slugs = yield* Effect.filter(names, (name) =>
            fs.stat(path.join(collection.directory, name)).pipe(
              Effect.map((info) => info.type === 'Directory'),
              Effect.orElseSucceed(() => false),
            ),
          )
          return yield* Effect.forEach(slugs, (slug) =>
            readDocument(collection, slug),
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
): Promise<ReadonlyArray<Document<A>>> =>
  Effect.runPromise(
    // The `S['DecodingServices'] extends KnownDecodingServices` constraint
    // above guarantees this is sound; tsc just can't distribute `Exclude`
    // over a constrained indexed-access type parameter to verify it itself.
    Collections.use((collections) => collections.getAll(collection)).pipe(
      Effect.provide(CollectionsLive),
    ) as Effect.Effect<ReadonlyArray<Document<A>>, CollectionError>,
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
