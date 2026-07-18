import { createFileRoute } from '@tanstack/react-router'

import { ImageResponse } from 'takumi-js/response'

import { OG_CARD_KINDS, OgCard, type OgCardKind } from '@/features/og/og-card'
import { getOgRenderer } from '@/features/og/og-fonts'

function parseKind(value: string | null): OgCardKind | undefined {
  return OG_CARD_KINDS.find((kind) => kind === value)
}

export const Route = createFileRoute('/api/og')({
  server: {
    handlers: {
      async GET({ request }) {
        const { searchParams } = new URL(request.url)
        const title = searchParams.get('title') ?? 'Noé Tatoud'
        const description =
          searchParams.get('description') ?? 'Software engineer.'
        const kind = parseKind(searchParams.get('kind'))

        return new ImageResponse(
          <OgCard title={title} description={description} kind={kind} />,
          {
            width: 1200,
            height: 630,
            format: 'png',
            renderer: await getOgRenderer(),
            headers: {
              'Cache-Control': 'public, immutable, max-age=31536000',
            },
          },
        )
      },
    },
  },
})
