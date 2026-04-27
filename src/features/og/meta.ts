import type { OgImageProps } from '@/features/og/og-image'
import { serializeOgSearchParams } from '@/features/og/search-params'
import { siteUrl } from '@/lib/site'

type OgMetaOptions = Omit<OgImageProps, 'avatar' | 'section'> & {
  url: string
  origin: string
  type?: 'article' | 'website'
  avatar?: string | null
  ogImageUrl?: string
}

export function ogMeta({
  title,
  description,
  author,
  tags,
  url,
  hero,
  avatar = null,
  origin,
  type = 'article',
  ogImageUrl: ogImageUrlOverride,
}: OgMetaOptions) {
  const section = url.split('/').filter(Boolean)[0] ?? null
  const ogImageUrl =
    ogImageUrlOverride ??
    siteUrl(
      origin,
      `/api/og${serializeOgSearchParams({ title, description, author, tags, hero, avatar, section })}`,
    )
  const pageUrl = siteUrl(origin, url)

  return [
    { title },
    { name: 'description', content: description ?? '' },
    { property: 'og:type', content: type },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description ?? '' },
    { property: 'og:image', content: ogImageUrl },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:url', content: pageUrl },
    { property: 'og:site_name', content: 'Noe Tatoud' },
    { property: 'og:locale', content: 'en_US' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@ntatoud' },
    { name: 'twitter:creator', content: '@ntatoud' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description ?? '' },
    { name: 'twitter:image', content: ogImageUrl },
    { name: 'twitter:url', content: pageUrl },
  ]
}

export function canonicalLink(url: string, origin: string) {
  return { rel: 'canonical', href: siteUrl(origin, url) }
}
