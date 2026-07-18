import { createFileRoute } from '@tanstack/react-router'

import { feed, getFeedItems } from '@/features/feed/feed'

export const Route = createFileRoute('/atom.xml')({
  server: {
    handlers: {
      async GET() {
        const xml = await feed.atom(await getFeedItems())
        return new Response(xml, {
          headers: {
            'Content-Type': 'application/atom+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=0, must-revalidate',
          },
        })
      },
    },
  },
})
