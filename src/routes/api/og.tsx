import { createFileRoute } from '@tanstack/react-router'
import { handleOgImage } from '@/features/og/handler'

export const Route = createFileRoute('/api/og')({
  server: {
    handlers: {
      GET: ({ request }) => handleOgImage(request),
    },
  },
})
