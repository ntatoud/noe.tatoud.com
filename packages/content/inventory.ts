import type { ListingName, PageKind } from './catalog/index.ts'
import type { ContentPages } from './pages.ts'
import { markdownPath, ogImagePath } from './paths.ts'

// The site's page inventory. Pure, and imports nothing at runtime but
// `paths.ts`, so the Vite config, `check:static` and the sitemap route can all
// build the same list: the first two from `readContentPages`, the sitemap from
// `virtual:content`.

/** A page with no content document behind it: its copy belongs to the app. */
export interface StaticPage {
  readonly path: string
  readonly title: string
  readonly description?: string
}

/** The home page and one page per catalog listing, keyed by listing name. */
export type StaticPages = { readonly home: StaticPage } & Readonly<
  Record<ListingName, StaticPage>
>

/** One page of the site and every file derived from it. */
export interface SitePage {
  readonly path: string
  readonly title: string
  readonly description?: string
  /** The badge its social card carries, if any. */
  readonly kind?: PageKind
  /** In the sitemap. Only drafts are unpublished. */
  readonly published: boolean
  /** The sitemap's `<lastmod>`. */
  readonly lastmod?: string
  /** Its social card (ADR-0010). */
  readonly ogImage: string
  /** Its markdown twin (ADR-0009). */
  readonly markdown: string
}

const withFiles = (page: Omit<SitePage, 'ogImage' | 'markdown'>): SitePage => ({
  ...page,
  ogImage: ogImagePath(page.path),
  markdown: markdownPath(page.path),
})

/**
 * Every page on the site, drafts included: the static pages in the order the
 * app declares them, then the content documents in catalog order.
 */
export const sitePages = (
  content: ContentPages,
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
          `[pages] the ${name} listing is at ${listing.path} in the catalog but ${page.path} in the app`,
        )
      }
      const kind = listing?.kind
      return withFiles({ ...page, ...(kind ? { kind } : {}), published: true })
    }),
    ...content.documents.map(withFiles),
  ]
}
