import type { ListingName, PageKind } from './catalog/index.ts'
import type { ContentInventory } from './pages.ts'
import { markdownPath, ogImagePath } from './paths.ts'

// Pure, importing only `paths.ts`, so every consumer builds the same list.

export interface StaticPage {
  readonly path: string
  readonly title: string
  readonly description?: string
}

export type StaticPages = { readonly home: StaticPage } & Readonly<
  Record<ListingName, StaticPage>
>

export interface SitePage {
  readonly path: string
  readonly title: string
  readonly description?: string
  readonly kind?: PageKind
  readonly published: boolean
  readonly lastmod?: string
  readonly ogImage: string
  readonly markdown: string
}

const withFiles = (page: Omit<SitePage, 'ogImage' | 'markdown'>): SitePage => ({
  ...page,
  ogImage: ogImagePath(page.path),
  markdown: markdownPath(page.path),
})

export const sitePages = (
  content: ContentInventory,
  staticPages: StaticPages,
): ReadonlyArray<SitePage> => {
  const listings = new Map(
    content.listings.map((listing) => [listing.name, listing]),
  )

  return [
    ...Object.entries(staticPages).map(([name, page]) => {
      const listing = listings.get(name as ListingName)
      if (listing && listing.path !== page.path) {
        throw new Error(
          `[inventory] the ${name} listing is at ${listing.path} in the catalog but ${page.path} in the app`,
        )
      }
      const kind = listing?.kind
      return withFiles({ ...page, ...(kind ? { kind } : {}), published: true })
    }),
    ...content.documents.map(withFiles),
  ]
}
