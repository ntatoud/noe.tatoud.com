import { parseFrontmatter } from '@ntatoud/effect-markdown'

import { NodeFileSystem, NodePath } from '@effect/platform-node'
import { Context, Effect, FileSystem, Layer, Path, Schema } from 'effect'

import { CollectionError } from './errors.ts'
import { DocumentDirectory } from './image.ts'

/**
 * Curried `mapError` that tags a boundary failure with the operation that
 * produced it and the file or directory it was working on.
 */
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
  /** Derives a document's final data from its decoded frontmatter. */
  readonly transform: (data: S['Type'], meta: CollectionMeta) => A
}

/**
 * The shape a document's `data` takes once the collection's `transform` has
 * run — i.e. what `getAll` hands back. Lets consumers name a
 * collection's output type without restating it, so it cannot drift from the
 * schema and transform that actually produce it.
 *
 * `C` is deliberately unconstrained: `transform` takes `S['Type']` as a
 * parameter, so a `C extends Collection<Schema.Constraint, unknown>` bound
 * rejects every real collection under `strictFunctionTypes`. The cost is that
 * passing a non-collection resolves to `never` here instead of erroring, which
 * surfaces as a missing-property error at the consumer.
 */
export type CollectionData<C> =
  C extends Collection<infer _S, infer A> ? A : never

/** Identity at runtime; exists so `S` and `A` are inferred from the literal. */
export const defineCollection = <S extends Schema.Constraint, A>(
  collection: Collection<S, A>,
): Collection<S, A> => collection

/**
 * A document without its rendered body. `getAll` returns these: rendering the
 * body (block parsing + syntax highlighting) is by far the most expensive step
 * of reading a document, and list views only ever need the frontmatter.
 */
export interface DocumentMeta<A> {
  readonly slug: string
  readonly data: A
  readonly source: string
}

// `Collections` provides `DocumentDirectory`, `FileSystem` and `Path` to every
// decode itself (the `Image` schema needs all three), so they never leak into
// what callers must provide. Only services a schema needs beyond those remain.
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

    // Frontmatter-only read: skips rendering the body, which dominates the
    // cost of reading a document and which `getAll` callers render themselves
    // when they need it.
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
