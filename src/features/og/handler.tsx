import { ImageResponse } from '@takumi-rs/image-response'
import { loadOgSearchParams } from '@/features/og/search-params'
import { OgImage } from '@/features/og/og-image'

export function handleOgImage(request: Request) {
  const { title, description, author, tags, hero } = loadOgSearchParams(request)

  return new ImageResponse(
    <OgImage
      title={title}
      description={description}
      author={author}
      tags={tags}
      hero={hero}
    />,
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control':
          'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      },
    },
  )
}
