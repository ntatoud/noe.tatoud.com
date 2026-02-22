import { ImageResponse } from '@takumi-rs/image-response'
import { loadOgSearchParams } from '@/features/og/search-params'
import { OgImage } from '@/features/og/og-image'

export async function handleOgImage(request: Request) {
  const { title, description, author, tags, hero } = loadOgSearchParams(request)
  const origin = new URL(request.url).origin
  const heroUrl = hero ? `${origin}${hero}` : null

  const fontData = await fetch(
    new URL('/fonts/GeistPixel-Square.woff2', origin),
  ).then((r) => r.arrayBuffer())

  return new ImageResponse(
    <OgImage
      title={title}
      description={description}
      author={author}
      tags={tags}
      hero={heroUrl}
    />,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Geist Pixel',
          data: fontData,
        },
      ],
      headers: {
        'Cache-Control': import.meta.env.DEV
          ? 'no-cache, no-store'
          : 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      },
    },
  )
}
