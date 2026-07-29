import type { ComponentType } from 'react'

import { MdxCompiler, MdxCompilerLive } from '@ntatoud/effect-mdx'

import { NodeFileSystem, NodePath } from '@effect/platform-node'
import { Context, Effect, FileSystem, Layer, Path, Schema } from 'effect'

import { CollectionError, DocumentNotFound } from './errors'
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

export { CollectionError, DocumentNotFound } from './errors'
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

/**
 * The shape a document's `data` takes once the collection's `transform` has
 * run — i.e. what `getAll`/`getBySlug` hand back. Lets consumers name a
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
    DocumentNotFound | CollectionError,
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

/** `NAME_MAX`: the longest single filesystem name Linux and macOS accept. */
const MAX_SLUG_BYTES = 255

/**
 * Whether a slug could name a document directory directly inside a collection.
 *
 * Slugs reach `getBySlug` straight from a URL segment, so they are arbitrary
 * attacker-controlled strings and are screened before they ever reach the
 * filesystem. Rejecting them here is what
 * - keeps `path.join` from walking outside the collection directory
 *   (`'../other-collection/doc'` would otherwise read a real document from a
 *   sibling collection), and
 * - keeps a value the OS cannot name — too long, or holding a NUL — from
 *   failing `stat` with a reason other than `NotFound`, which would surface as a
 *   500 for what is plainly just a junk URL a crawler invented.
 */
const isDocumentSlug = (slug: string): boolean =>
  slug.length > 0 &&
  new TextEncoder().encode(slug).length <= MAX_SLUG_BYTES &&
  !slug.includes('/') &&
  !slug.includes('\\') &&
  !slug.includes('\0') &&
  slug !== '.' &&
  slug !== '..'

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
        // `getBySlug` is fed arbitrary slugs (a URL segment), so a genuinely
        // missing document is expected input rather than a failure of the read.
        // Only an unusable slug or a `NotFound` stat reason becomes
        // `DocumentNotFound` — any other reason (e.g. `PermissionDenied`) stays
        // a `CollectionError`, so a real IO problem can never masquerade as
        // missing content.
        const documentNotFound = () =>
          new DocumentNotFound({ collection: collection.name, slug })

        if (!isDocumentSlug(slug)) {
          return yield* Effect.fail(documentNotFound())
        }

        const info = yield* fs.stat(path.join(collection.directory, slug)).pipe(
          Effect.catch((error) =>
            Effect.gen(function* () {
              if (error.reason._tag !== 'NotFound') {
                return yield* Effect.fail(
                  new CollectionError({ operation: 'stat', cause: error }),
                )
              }
              // A missing path means a missing *document* only if the collection
              // directory itself is there. When the whole directory is gone —
              // a content root that did not ship with the deploy, say — every
              // detail page would otherwise answer a silent 404, with nothing
              // logged, instead of reporting the misconfiguration.
              const collectionExists = yield* fs
                .exists(collection.directory)
                .pipe(collectionError('exists'))
              return yield* Effect.fail(
                collectionExists
                  ? documentNotFound()
                  : new CollectionError({ operation: 'stat', cause: error }),
              )
            }),
          ),
        )

        // A file (or socket, device, …) sitting where a document directory
        // should be is not a readable document either.
        if (info.type !== 'Directory') {
          return yield* Effect.fail(documentNotFound())
        }

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
