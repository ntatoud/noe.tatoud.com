import type { ListingName, PageKind } from './catalog/index.ts'
import { collectionsOf, readContent, type ContentSnapshot } from './snapshot.ts'

export interface ContentPage {
  readonly path: string
  readonly title: string
  readonly description?: string
  readonly kind: PageKind
  readonly published: boolean
  readonly lastmod?: string
}

export interface ListingPage {
  readonly name: ListingName
  readonly path: string
  readonly kind?: PageKind
}

export interface ContentInventory {
  readonly documents: ReadonlyArray<ContentPage>
  readonly listings: ReadonlyArray<ListingPage>
}

export const contentInventoryOf = (
  content: ContentSnapshot,
): ContentInventory => {
  const collections = collectionsOf(content)
  return {
    documents: collections.flatMap(({ detail }) =>
      detail
        ? detail.documents.map(
            ({ path, title, description, published, lastmod }) => ({
              path,
              title,
              ...(description ? { description } : {}),
              kind: detail.kind,
              published,
              ...(lastmod ? { lastmod } : {}),
            }),
          )
        : [],
    ),
    listings: collections.flatMap(({ listingPage, detail }) =>
      listingPage
        ? [{ ...listingPage, ...(detail ? { kind: detail.kind } : {}) }]
        : [],
    ),
  }
}

export const readContentPages = async (): Promise<ContentInventory> =>
  contentInventoryOf(await readContent())
