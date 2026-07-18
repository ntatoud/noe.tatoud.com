import { createFileRoute } from '@tanstack/react-router'

import { Option, Schema } from 'effect'

import { OgKind } from '@/features/og/metadata'
import { OgCard } from '@/features/og/og-card'
import { ogImage } from '@/features/og/og-image'

const decodeKind = Schema.decodeUnknownOption(OgKind)

export const Route = createFileRoute('/api/og')({
  server: {
    handlers: {
      async GET({ request }) {
        const { searchParams } = new URL(request.url)
        const title = searchParams.get('title') ?? 'Noé Tatoud'
        const description =
          searchParams.get('description') ?? 'Software engineer.'
        const kind = Option.getOrUndefined(decodeKind(searchParams.get('kind')))

        return ogImage.render(
          <OgCard title={title} description={description} kind={kind} />,
        )
      },
    },
  },
})
