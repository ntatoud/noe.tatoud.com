import { Collections } from '@ntatoud/effect-collections'
import type { Collection, DocumentMeta } from '@ntatoud/effect-collections'

import { Effect, type Schema } from 'effect'

import type { IndexEntry } from '../markdown.ts'

/** What a document's page and its markdown twin show of its frontmatter. */
export interface DetailPage {
  readonly path: string
  readonly title: string
  readonly description?: string | undefined
  /** The twin's metadata lines, already formatted as `- Key: value`. */
  readonly details: ReadonlyArray<string | null>
}

/**
 * A Content Collection as the build sees it: where its documents live, how
 * they are listed, and which pages they get. Each facet is a judgement about
 * that collection's frontmatter, so it is spelled out per collection rather
 * than derived generically.
 */
interface ContentCollectionDefinition<
  S extends Schema.Constraint,
  A,
  K extends string,
  Kind extends string,
  L extends string,
> {
  /** The `virtual:content` export holding the listing, and the detail ids' segment. */
  readonly key: K
  readonly collection: Collection<S, A>
  /** The Reader: filters and orders the published documents for listings. */
  readonly reader: (
    documents: ReadonlyArray<DocumentMeta<A>>,
  ) => ReadonlyArray<A>
  /** The collection's section in `/index.md` and `/llms.txt`. */
  readonly index: {
    readonly title: string
    readonly entry: (data: A) => IndexEntry
  }
  /** A listing route, e.g. `/blog`, with its own markdown twin. */
  readonly listingPage?: { readonly name: L; readonly path: string }
  /** A page per document, drafts included (ADR-0008). */
  readonly detail?: {
    /** The `virtual:content` export mapping slugs to detail chunks. */
    readonly loader: string
    /** The badge its social card carries. */
    readonly kind: Kind
    readonly page: (data: A) => DetailPage
  }
}

export interface DetailDocument<A> extends DetailPage {
  readonly slug: string
  readonly source: string
  readonly data: A
}

/** One Content Collection, read once: everything the build emits for it. */
export interface CollectionSnapshot<
  K extends string,
  A,
  Kind extends string,
  L extends string,
> {
  readonly key: K
  readonly directory: string
  /** Published documents, ordered by the Reader. */
  readonly listing: ReadonlyArray<A>
  readonly index: {
    readonly title: string
    readonly entries: ReadonlyArray<IndexEntry>
  }
  readonly listingPage: { readonly name: L; readonly path: string } | undefined
  readonly detail:
    | {
        readonly loader: string
        readonly kind: Kind
        /** Every document on disk, drafts included, sorted by slug. */
        readonly documents: ReadonlyArray<DetailDocument<A>>
      }
    | undefined
}

// Plain code-unit order, so the generated loader maps list slugs the same way
// on every machine.
const bySlug = <A>(documents: ReadonlyArray<DocumentMeta<A>>) =>
  [...documents].sort((a, b) =>
    a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0,
  )

/**
 * Declares a Content Collection for the catalog. `read` reads its documents
 * from disk exactly once and derives the listing, the index entries and the
 * detail pages from that one read.
 */
export const defineContentCollection = <
  S extends Schema.Constraint,
  A,
  K extends string,
  Kind extends string = never,
  L extends string = never,
>(
  definition: ContentCollectionDefinition<S, A, K, Kind, L>,
) => {
  const { key, collection, reader, index, listingPage, detail } = definition

  const snapshot = (
    documents: ReadonlyArray<DocumentMeta<A>>,
  ): CollectionSnapshot<K, A, Kind, L> => {
    const listing = reader(documents)
    return {
      key,
      directory: collection.directory,
      listing,
      index: { title: index.title, entries: listing.map(index.entry) },
      listingPage,
      detail: detail && {
        loader: detail.loader,
        kind: detail.kind,
        documents: bySlug(documents).map(({ slug, source, data }) => ({
          slug,
          source,
          data,
          ...detail.page(data),
        })),
      },
    }
  }

  return {
    ...definition,
    read: Effect.gen(function* () {
      const collections = yield* Collections
      return snapshot(yield* collections.getAll(collection))
    }),
  }
}
