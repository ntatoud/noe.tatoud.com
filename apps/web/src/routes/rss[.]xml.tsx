import { createFileRoute } from '@tanstack/react-router'

import { feed, getFeedItems } from '@/features/feed/feed'

export const Route = createFileRoute('/rss.xml')({
  server: {
    handlers: {
      async GET() {
        const xml = await feed.rss(await getFeedItems())
        return new Response(xml, {
          headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=0, must-revalidate',
          },
        })
      },
    },
  },
})
