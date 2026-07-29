import { createFileRoute } from '@tanstack/react-router'

import { isOgKind } from '@/features/og/metadata'
import { OgCard } from '@/features/og/og-card'
import { renderOgImage } from '@/features/og/og-image'

export const Route = createFileRoute('/api/og')({
  server: {
    handlers: {
      async GET({ request }) {
        const { searchParams } = new URL(request.url)
        const title = searchParams.get('title') ?? 'Noé Tatoud'
        const description =
          searchParams.get('description') ?? 'Software engineer.'
        const rawKind = searchParams.get('kind')
        const kind = isOgKind(rawKind) ? rawKind : undefined

        return renderOgImage(
          <OgCard title={title} description={description} kind={kind} />,
        )
      },
    },
  },
})
