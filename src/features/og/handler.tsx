import { ImageResponse } from '@takumi-rs/image-response/wasm'
import wasmBuffer from '@takumi-rs/wasm/takumi_wasm_bg.wasm?arraybuffer'
import { loadOgSearchParams } from '@/features/og/search-params'
import { OgImage } from '@/features/og/og-image'

export function handleOgImage(request: Request) {
  const { title, description, author, tags, hero } = loadOgSearchParams(request)
  const origin = new URL(request.url).origin
  const heroUrl = hero ? `${origin}${hero}` : null

  return new ImageResponse(
    <OgImage
      title={title}
      description={description}
      author={author}
      tags={tags}
      hero={heroUrl}
    />,
    {
      module: wasmBuffer,
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': import.meta.env.DEV
          ? 'no-cache, no-store'
          : 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      },
    },
  )
}
