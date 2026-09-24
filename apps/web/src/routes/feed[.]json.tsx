import { createFileRoute } from '@tanstack/react-router'

import { feedResponse } from '@/features/feed/feed'

export const Route = createFileRoute('/feed.json')({
  server: { handlers: { GET: () => feedResponse('json') } },
})
