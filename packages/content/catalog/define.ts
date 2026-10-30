import { Collections } from '@ntatoud/effect-collections'
import type { Collection, DocumentMeta } from '@ntatoud/effect-collections'

import { Effect, type Schema } from 'effect'

import type { IndexEntry } from '../markdown.ts'

export interface DetailPage {
  readonly path: string
  readonly title: string
  readonly description?: string | undefined
  readonly lastmod?: string | undefined
  readonly details: ReadonlyArray<string | null>
}

interface ContentCollectionDefinition<
  S extends Schema.Constraint,
  A,
  K extends string,
  Kind extends string,
  L extends string,
> {
  readonly key: K
  readonly collection: Collection<S, A>
  // Returns the documents' own `data` objects, not copies: published means `data` is in the listing.
  readonly reader: (
    documents: ReadonlyArray<DocumentMeta<A>>,
  ) => ReadonlyArray<A>
  readonly index: {
    readonly title: string
    readonly entry: (data: A) => IndexEntry
  }
  readonly listingPage?: { readonly name: L; readonly path: string }
  readonly detail?: {
    readonly loader: string
    readonly kind: Kind
    readonly page: (data: A) => DetailPage
  }
}

export interface DetailDocument<A> extends DetailPage {
  readonly slug: string
  readonly published: boolean
  readonly source: string
  readonly data: A
}

export interface CollectionSnapshot<
  K extends string,
  A,
  Kind extends string,
  L extends string,
> {
  readonly key: K
  readonly directory: string
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
        readonly documents: ReadonlyArray<DetailDocument<A>>
      }
    | undefined
}

// Plain code-unit order, so slugs map the same way on every machine.
const bySlug = <A>(documents: ReadonlyArray<DocumentMeta<A>>) =>
  [...documents].sort((a, b) =>
    a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0,
  )

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
    const listed = new Set<A>(listing)
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
          published: listed.has(data),
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
