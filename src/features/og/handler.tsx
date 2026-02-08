import { ImageResponse } from '@takumi-rs/image-response'
import { OgImage } from '@/features/og/og-image'

export function handleOgImage(request: Request) {
  const url = new URL(request.url)

  const title = url.searchParams.get('title') || 'Noe Tatoud'
  const description = url.searchParams.get('description') || undefined
  const author = url.searchParams.get('author') || undefined
  const tagsParam = url.searchParams.get('tags')
  const tags = tagsParam ? tagsParam.split(',') : undefined

  return new ImageResponse(
    <OgImage
      title={title}
      description={description}
      author={author}
      tags={tags}
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
