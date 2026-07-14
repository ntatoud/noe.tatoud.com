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

/** Services every reader needs at run time. */
export type CollectionDeps =
  | CollectionsConfig
  | HighlighterService
  | FileSystem.FileSystem
  | Path.Path

/** Services image resolution / `toMetadata` needs (the highlighter is body-only). */
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

/**
 * The frontmatter after image fields are resolved: every `ImageRef` declared by
 * an {@link Image}/{@link Logo} schema field becomes a `ResolvedImage`.
 */
export type ResolvedFrontmatter<S extends FrontmatterSchema> = ResolveImageRefs<
  S['Type']
>

/**
 * The default per-Document metadata when a collection provides no `toMetadata`:
 * the image-resolved frontmatter plus the auto-added `slug` and `url`.
 */
export type DefaultMeta<S extends FrontmatterSchema> =
  ResolvedFrontmatter<S> & {
    readonly slug: string
    readonly url: string
  }

/** Arguments handed to a collection's `toMetadata` for each Document. */
export type ToMetadataArgs<F> = {
  readonly slug: string
  /** The auto-derived public URL: `/${collectionName}/${slug}`. */
  readonly url: string
  /** The frontmatter with all image fields already resolved. */
  readonly frontmatter: F
}

/**
 * A collection definition: how to read, validate, (optionally) reshape, filter
 * and order the Documents of one collection. `S` is the frontmatter schema
 * type; `Meta` is the public per-Document metadata the readers expose.
 *
 * When `toMetadata` is omitted, `Meta` is {@link DefaultMeta}. When provided, it
 * receives the image-resolved frontmatter plus `{ slug, url }` and returns the
 * final `Meta`.
 */
export type Collection<S extends FrontmatterSchema, Meta extends object> = {
  /** Collection name — also its directory under `contentRoot`. */
  readonly name: string
  /** Frontmatter schema; image fields (`Image`/`Logo`) auto-resolve. */
  readonly schema: S
  /** Optional reshape of the resolved frontmatter into public metadata. */
  readonly toMetadata?: (
    args: ToMetadataArgs<ResolvedFrontmatter<S>>,
  ) => Effect.Effect<Meta, never, ResolveDeps>
  /** Keep only Documents matching this predicate in `list` (e.g. published). */
  readonly include?: (meta: Meta) => boolean
  /** Sort comparator applied to `list`. */
  readonly order?: (a: Meta, b: Meta) => number
}

/**
 * Declares a content collection. The identity at run time; its job is to infer
 * and lock in the schema/metadata types so {@link makeReaders} stays fully typed.
 *
 * With `toMetadata`, `Meta` is inferred from its result. Without it, `Meta` is
 * the {@link DefaultMeta} (resolved frontmatter + `slug`/`url`).
 */
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

/** The reader pair produced for a collection. */
export type Readers<Meta extends object> = {
  /**
   * All Documents' metadata: list slugs → read + validate + image-resolve
   * frontmatter → (`toMetadata`) → filter (`include`) → sort (`order`).
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
