import { Effect, FileSystem, Path, Schema } from 'effect'

import { CollectionsConfig } from '#core/config'
import {
  CompileFailed,
  ContentNotFound,
  FrontmatterInvalid,
} from '#core/errors'
import { HighlighterService } from '#core/highlighter'
import {
  resolveImage,
  resolveLogo,
  type ResolvedImage,
  type ResolvedLogo,
} from '#core/image'
import { compileMdxBody } from '#core/mdx'
import { documentMtime, listSlugs, readDocument } from '#core/source'

/** Services every reader needs at run time. */
export type CollectionDeps =
  | CollectionsConfig
  | HighlighterService
  | FileSystem.FileSystem
  | Path.Path

/** Services image/metadata resolution needs (the highlighter is body-only). */
type ResolveDeps = CollectionsConfig | FileSystem.FileSystem | Path.Path

/**
 * A frontmatter schema whose decode/encode requires no services — the only kind
 * a content pipeline needs. Pinning the service channels to `never` keeps the
 * readers' requirement channel down to {@link CollectionDeps}.
 */
export type FrontmatterSchema = Schema.Top & {
  readonly DecodingServices: never
  readonly EncodingServices: never
}

/** Arguments handed to a collection's `toMetadata` for each Document. */
export type ToMetadataArgs<A> = {
  readonly slug: string
  readonly frontmatter: A
  /** The configured public asset prefix (e.g. `/content`). */
  readonly assetBaseUrl: string
  /** Resolves a ref colocated with this Document to a public URL + dimensions. */
  readonly resolveImage: (
    ref: string,
  ) => Effect.Effect<ResolvedImage, never, ResolveDeps>
  /** Resolves a small logo ref to an inlined `data:` URL + dimensions. */
  readonly resolveLogo: (
    ref: string,
  ) => Effect.Effect<ResolvedLogo, never, ResolveDeps>
}

/**
 * A collection definition: how to read, validate, shape, filter and order the
 * Documents of one collection. `S` is the frontmatter schema type; `Meta` is the
 * public per-Document metadata the readers expose.
 */
export type CollectionDefinition<
  S extends FrontmatterSchema,
  Meta extends object,
> = {
  /** Collection name — also its directory under `contentRoot`. */
  readonly name: string
  /** Frontmatter schema; its decoded type feeds `toMetadata`. */
  readonly schema: S
  /** Builds public metadata from a Document's validated frontmatter. */
  readonly toMetadata: (
    args: ToMetadataArgs<S['Type']>,
  ) => Effect.Effect<Meta, never, ResolveDeps>
  /** Keep only Documents matching this predicate in `list` (e.g. published). */
  readonly include?: (meta: Meta) => boolean
  /** Sort comparator applied to `list`. */
  readonly order?: (a: Meta, b: Meta) => number
}

/** An opaque, validated collection ready to be turned into readers. */
export type Collection<
  S extends FrontmatterSchema,
  Meta extends object,
> = CollectionDefinition<S, Meta>

/**
 * Declares a content collection. The identity at run time; its job is to infer
 * and lock in the schema/metadata types so {@link makeReaders} stays fully typed.
 */
export const defineCollection = <
  S extends FrontmatterSchema,
  Meta extends object,
>(
  def: CollectionDefinition<S, Meta>,
): Collection<S, Meta> => def

/** The reader pair produced for a collection. */
export type Readers<Meta extends object> = {
  /**
   * All Documents' metadata: list slugs → read + validate frontmatter →
   * `toMetadata` → filter (`include`) → sort (`order`).
   */
  readonly list: Effect.Effect<
    ReadonlyArray<Meta>,
    ContentNotFound | FrontmatterInvalid,
    CollectionDeps
  >
  /**
   * One Document's metadata plus its compiled `body` (function-body string).
   * Compilation is memoized in-memory, keyed by slug + file mtime.
   */
  readonly get: (
    slug: string,
  ) => Effect.Effect<
    Meta & { body: string },
    ContentNotFound | FrontmatterInvalid | CompileFailed,
    CollectionDeps
  >
}

/**
 * Builds the `list`/`get` readers for a collection. The compiled-body cache is
 * held in this call's closure, so call it once per long-lived consumer.
 */
export const makeReaders = <S extends FrontmatterSchema, Meta extends object>(
  collection: Collection<S, Meta>,
): Readers<Meta> => {
  const name = collection.name
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
    assetBaseUrl: string,
  ) =>
    collection.toMetadata({
      slug,
      frontmatter,
      assetBaseUrl,
      resolveImage: (ref) => resolveImage(name, slug, ref),
      resolveLogo: (ref) => resolveLogo(name, slug, ref),
    })

  const list = Effect.gen(function* () {
    const { assetBaseUrl } = yield* CollectionsConfig
    const slugs = yield* listSlugs(name)
    const metas = yield* Effect.forEach(slugs, (slug) =>
      readDocument(name, slug).pipe(
        Effect.flatMap(({ data }) => validate(slug, data)),
        Effect.flatMap((frontmatter) =>
          buildMeta(slug, frontmatter, assetBaseUrl),
        ),
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
      const meta = yield* buildMeta(slug, frontmatter, assetBaseUrl)
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
