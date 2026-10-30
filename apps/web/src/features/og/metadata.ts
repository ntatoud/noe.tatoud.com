import { ogImagePath } from '@ntatoud/content/paths'

import { SITE_NAME, SITE_URL } from '@/lib/site'

// Dependency-free (no `effect`): imported by the root route, so it ships in every client bundle.

type MetaTag =
  | { title: string }
  | { charSet: string }
  | { name: string; content: string }
  | { property: string; content: string }

const OG_TYPE = 'website'
const TWITTER_CARD = 'summary_large_image'
const IMAGE_WIDTH = 1200
const IMAGE_HEIGHT = 630

interface PageMetadataInput {
  title: string
  description?: string
  path?: string
}

export const BASE_META_TAGS: MetaTag[] = [
  { charSet: 'utf-8' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1' },
]

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
