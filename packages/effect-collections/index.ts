import { parseFrontmatter } from '@ntatoud/effect-markdown'

import { NodeFileSystem, NodePath } from '@effect/platform-node'
import { Context, Effect, FileSystem, Layer, Path, Schema } from 'effect'

import { CollectionError } from './errors.ts'
import { DocumentDirectory } from './image.ts'

const collectionError =
  (operation: string, path: string) =>
  <A, E, R>(
    effect: Effect.Effect<A, E, R>,
  ): Effect.Effect<A, CollectionError, R> =>
    Effect.mapError(
      effect,
      (cause) => new CollectionError({ operation, path, cause }),
    )

export { CollectionError } from './errors.ts'
export { DocumentDirectory, Image } from './image.ts'
export type { ImageValue } from './image.ts'

export interface CollectionMeta {
  readonly slug: string
  readonly directory: string
}

export interface Collection<S extends Schema.Constraint, A> {
  readonly name: string
  readonly directory: string
  readonly schema: S
  readonly transform: (data: S['Type'], meta: CollectionMeta) => A
}

// Unconstrained: a `Collection<Schema.Constraint, unknown>` bound rejects every real collection under `strictFunctionTypes`.
export type CollectionData<C> =
  C extends Collection<infer _S, infer A> ? A : never

export const defineCollection = <S extends Schema.Constraint, A>(
  collection: Collection<S, A>,
): Collection<S, A> => collection

export interface DocumentMeta<A> {
  readonly slug: string
  readonly data: A
  readonly source: string
}

// `Collections` provides these to every decode itself, so callers need not.
type ExternalDecodingServices<S extends Schema.Constraint> = Exclude<
  S['DecodingServices'],
  DocumentDirectory | FileSystem.FileSystem | Path.Path
>

export interface CollectionsShape {
  readonly getAll: <S extends Schema.Constraint, A>(
    collection: Collection<S, A>,
  ) => Effect.Effect<
    ReadonlyArray<DocumentMeta<A>>,
    CollectionError,
    ExternalDecodingServices<S>
  >
}

export class Collections extends Context.Service<
  Collections,
  CollectionsShape
>()('effect-collections/Collections') {}

const make = Layer.effect(
  Collections,
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path

    const decodeData = <S extends Schema.Constraint, A>(
      collection: Collection<S, A>,
      slug: string,
      file: string,
      frontmatter: Record<string, unknown>,
    ) =>
      Effect.gen(function* () {
        const decoded = yield* Schema.decodeUnknownEffect(collection.schema)(
          frontmatter,
        ).pipe(
          Effect.provide(
            Context.make(
              DocumentDirectory,
              path.join(collection.directory, slug),
            ).pipe(
              Context.add(FileSystem.FileSystem, fs),
              Context.add(Path.Path, path),
            ),
          ),
          collectionError('decode', file),
        )
        return collection.transform(decoded, {
          slug,
          directory: collection.directory,
        })
      })

    // Skips rendering the body, which dominates the cost of reading a document.
    const readDocumentMeta = <S extends Schema.Constraint, A>(
      collection: Collection<S, A>,
      slug: string,
    ) =>
      Effect.gen(function* () {
        const file = path.join(collection.directory, slug, 'index.mdx')
        const source = yield* fs
          .readFileString(file)
          .pipe(collectionError('readFile', file))
        const frontmatter = yield* parseFrontmatter(source).pipe(
          collectionError('frontmatter', file),
        )
        const data = yield* decodeData(collection, slug, file, frontmatter)
        return { slug, data, source } satisfies DocumentMeta<A>
      })

    return Collections.of({
      getAll: (collection) =>
        Effect.gen(function* () {
          const names = yield* fs
            .readDirectory(collection.directory)
            .pipe(collectionError('readDirectory', collection.directory))
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
  Layer.provide(NodeFileSystem.layer),
  Layer.provide(NodePath.layer),
)
