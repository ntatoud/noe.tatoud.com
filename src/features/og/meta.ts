import { serializeOgSearchParams } from '@/features/og/search-params'
import { siteUrl } from '@/lib/site'

interface OgMetaOptions {
  title: string
  description?: string | null
  author?: string | null
  tags?: Array<string> | null
  url: string
  hero?: string | null
}

export function ogMeta({
  title,
  description,
  author,
  tags,
  url,
  hero,
}: OgMetaOptions) {
  const ogImageUrl = siteUrl(
    `/api/og${serializeOgSearchParams({ title, description, author, tags, hero })}`,
  )
  const pageUrl = siteUrl(url)

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
