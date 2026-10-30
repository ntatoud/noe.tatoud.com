import type { ListingName, PageKind } from './catalog/index.ts'
import { collectionsOf, readContent, type ContentSnapshot } from './snapshot.ts'

/** A page backed by a content document, with what its social card shows. */
export interface ContentPage {
  readonly path: string
  readonly title: string
  readonly description?: string
  readonly kind: PageKind
  /** Listed, so in the sitemap. A draft keeps its page but is not listed. */
  readonly published: boolean
  /** The sitemap's `<lastmod>`. */
  readonly lastmod?: string
}

/** A collection's listing route, e.g. `/blog`. Its copy lives in the app. */
export interface ListingPage {
  readonly name: ListingName
  readonly path: string
  /** The kind of the documents it lists, for its social card's badge. */
  readonly kind?: PageKind
}

export interface ContentPages {
  /** Every content document's page, drafts included, in catalog order. */
  readonly documents: ReadonlyArray<ContentPage>
  readonly listings: ReadonlyArray<ListingPage>
}

/**
 * The pages the Content Catalog contributes to the site, drafts included
 * (ADR-0008: a draft keeps a reachable page). Optional fields are omitted
 * rather than set to `undefined`, so the result serializes as-is.
 */
export const contentPagesOf = (content: ContentSnapshot): ContentPages => {
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

/**
 * Reads the content pages from disk. The prerender pass needs them because its
 * link crawler cannot find a page nothing links to (posts and projects hosted
 * elsewhere have cards that link off-site); the OG image build and
 * `check:static` need every one of them too.
 */
export const readContentPages = async (): Promise<ContentPages> =>
  contentPagesOf(await readContent())
