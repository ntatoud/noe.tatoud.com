import { createFileRoute, notFound } from '@tanstack/react-router'

import { handleOgImage } from '@/features/og/handler'
import { serializeOgSearchParams } from '@/features/og/search-params'
import { blog } from '@/lib/source'

export const Route = createFileRoute('/blog/$slug/assets/og-image')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const page = blog.getPage([params.slug])
        if (!page) throw notFound()

        const origin = new URL(request.url).origin
        const section = page.url.split('/').filter(Boolean)[0] ?? null
        const hero = (page.data._exports.hero as string | undefined) ?? null

        const ogUrl = new URL(
          `/api/og${serializeOgSearchParams({
            title: page.data.title,
            description: page.data.description ?? null,
            author: page.data.author,
            tags: page.data.tags ?? null,
            hero,
            avatar: null,
            section,
          })}`,
          origin,
        )

        return handleOgImage(new Request(ogUrl))
      },
    },
  },
})
