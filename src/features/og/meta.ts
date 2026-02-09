import type { OgImageProps } from '@/features/og/og-image'
import { serializeOgSearchParams } from '@/features/og/search-params'
import { siteUrl } from '@/lib/site'

type OgMetaOptions = OgImageProps & { url: string; origin: string }

export function ogMeta({
  title,
  description,
  author,
  tags,
  url,
  hero,
  origin,
}: OgMetaOptions) {
  const ogImageUrl = siteUrl(
    origin,
    `/api/og${serializeOgSearchParams({ title, description, author, tags, hero })}`,
  )
  const pageUrl = siteUrl(origin, url)

  return [
    { title },
    { name: 'description', content: description ?? '' },
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description ?? '' },
    { property: 'og:image', content: ogImageUrl },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:url', content: pageUrl },
    { property: 'og:site_name', content: 'Noe Tatoud' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description ?? '' },
    { name: 'twitter:image', content: ogImageUrl },
  ]
}
