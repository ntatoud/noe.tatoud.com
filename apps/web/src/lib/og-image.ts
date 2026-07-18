import type { OgCardKind } from '@/features/og/og-card'
import { SITE_URL } from '@/lib/site'

export type OgImageParams = {
  title: string
  description?: string
  kind?: OgCardKind
  /** Canonical pathname for this page, e.g. `/blog/my-post` — used for `og:url`. */
  path: string
}

function buildOgImageUrl({
  title,
  description,
  kind,
}: Omit<OgImageParams, 'path'>) {
  const params = new URLSearchParams({ title })
  if (description) params.set('description', description)
  if (kind) params.set('kind', kind)
  return `${SITE_URL}/api/og?${params.toString()}`
}

export function buildOgMeta({ title, description, kind, path }: OgImageParams) {
  const image = buildOgImageUrl({ title, description, kind })
  return [
    { property: 'og:title', content: title },
    ...(description
      ? [{ property: 'og:description', content: description }]
      : []),
    { property: 'og:url', content: `${SITE_URL}${path}` },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: image },
  ]
}
