import { createFileRoute } from '@tanstack/react-router'

import { feedResponse } from '@/features/feed/feed'

export const Route = createFileRoute('/atom.xml')({
  server: { handlers: { GET: () => feedResponse('atom') } },
})
