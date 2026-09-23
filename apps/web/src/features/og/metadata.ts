import { SITE_NAME, SITE_URL, ogImagePath } from '@/lib/site'

/**
 * Meta tags for this site's pages. The images the tags point at are rendered
 * at build time (ADR-0010).
 *
 * Kept dependency-free (no `effect`) since this module is imported from the
 * root route and ships in every client bundle.
 */

/**
 * A single `<meta>`/`<title>` descriptor. Modeled as a union so every tag
 * emitted by {@link toMetaTags} is a fully-typed member rather than an
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

/** Semantic, page-level metadata: the composable surface routes describe. */
interface PageMetadataInput {
  /** Document title: drives `<title>`, `og:title`, and `twitter:title`. */
  title: string
  /** Summary: drives `description`, `og:description`, `twitter:description`. */
  description?: string
  /** Canonical pathname, e.g. `/blog/my-post`: drives `og:url` and the OG image. */
  path?: string
}

/** Site-wide tags for the root document, never repeated per page. */
export const BASE_META_TAGS: MetaTag[] = [
  { charSet: 'utf-8' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1' },
]

/** Derive the full, deduplicated set of meta tags for a page. */
export const toMetaTags = ({
  title,
  description,
  path = '/',
}: PageMetadataInput): MetaTag[] => {
  const url = `${SITE_URL}${path}`
  const image = `${SITE_URL}${ogImagePath(path)}`

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
