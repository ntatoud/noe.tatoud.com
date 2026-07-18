import { createFileRoute } from '@tanstack/react-router'

import { feed, getFeedItems } from '@/features/feed/feed'

export const Route = createFileRoute('/feed.json')({
  server: {
    handlers: {
      async GET() {
        const json = await feed.json(await getFeedItems())
        return new Response(json, {
          headers: {
            'Content-Type': 'application/feed+json; charset=utf-8',
            'Cache-Control': 'public, max-age=0, must-revalidate',
          },
        })
      },
    },
  },
})
