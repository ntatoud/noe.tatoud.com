import { createFileRoute } from '@tanstack/react-router'

import { NotFound } from '@/components/error/not-found'

// Prerendered to `404.html`: no server renders a 404 at request time (ADR-0011).
export const Route = createFileRoute('/404')({
  component: NotFound,
  head: () => ({
    meta: [
      { title: 'Not found | Noé Tatoud' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
})
