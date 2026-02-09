import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/og')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { handleOgImage } = await import('@/features/og/handler')
        return handleOgImage(request)
      },
    },
  },
})
