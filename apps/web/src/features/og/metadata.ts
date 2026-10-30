import { sitePages } from '@ntatoud/content/inventory'
import type { SitePage } from '@ntatoud/content/inventory'

import { contentInventory } from 'virtual:content'

import { SITE_NAME, SITE_URL, STATIC_PAGES } from '@/lib/site'

/**
 * Meta tags for this site's pages, read from the Page Inventory so a page's
 * tags, its social card (ADR-0010) and its markdown twin (ADR-0009) cannot
 * describe it differently.
 *
 * Kept dependency-free (no `effect`): `head` also runs on client-side
 * navigation, so this module and the inventory ship in the client bundle.
 */

/**
 * A single `<meta>`/`<title>` descriptor. Modeled as a union so every tag
 * emitted by {@link pageMeta} is a fully-typed member rather than an
 * anonymous JSON object. The shapes line up with what TanStack Router's
 * `head`/`meta` API accepts.
 */
type MetaTag =
  | { title: string }
  | { charSet: string }
  | { name: string; content: string }
  | { property: string; content: string }

const OG_TYPE = 'website'
const TWITTER_CARD = 'summary_large_image'
const IMAGE_WIDTH = 1200
const IMAGE_HEIGHT = 630

/** Site-wide tags for the root document, never repeated per page. */
export const BASE_META_TAGS: MetaTag[] = [
  { charSet: 'utf-8' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1' },
]

const PAGES = new Map(
  sitePages(contentInventory, STATIC_PAGES).map((page) => [page.path, page]),
)

/** Derive the full, deduplicated set of meta tags for a page. */
const toMetaTags = ({
  title,
  description,
  path,
  ogImage,
}: SitePage): MetaTag[] => {
  const url = `${SITE_URL}${path}`
  const image = `${SITE_URL}${ogImage}`

  return [
    { title },
    ...(description ? [{ name: 'description', content: description }] : []),
    { property: 'og:type', content: OG_TYPE },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:title', content: title },
    ...(description
      ? [{ property: 'og:description', content: description }]
      : []),
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: String(IMAGE_WIDTH) },
    { property: 'og:image:height', content: String(IMAGE_HEIGHT) },
    { name: 'twitter:card', content: TWITTER_CARD },
    { name: 'twitter:url', content: url },
    { name: 'twitter:title', content: title },
    ...(description
      ? [{ name: 'twitter:description', content: description }]
      : []),
    { name: 'twitter:image', content: image },
  ]
}

/**
 * Every meta tag of the page at `pathname`. A path missing from the Page
 * Inventory throws, so an undeclared route fails the prerender (ADR-0011)
 * instead of shipping without its tags.
 */
export const pageMeta = (pathname: string): MetaTag[] => {
  const page = PAGES.get(pathname.replace(/(.)\/+$/, '$1'))
  if (!page) {
    throw new Error(`[page meta] ${pathname} is not in the Page Inventory`)
  }
  return toMetaTags(page)
}
