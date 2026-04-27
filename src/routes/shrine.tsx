import { createFileRoute } from '@tanstack/react-router'

import { getRiddle } from '@/features/achievements/check-riddle'
import { PageRiddle } from '@/features/achievements/page-riddle'

export const Route = createFileRoute('/shrine')({
  loader: () => getRiddle(),
  component: Page,
  head: () => ({
    meta: [
      { title: 'The Shrine | Noé Tatoud' },
      {
        name: 'description',
        content: 'A secret corner of the site. Solve the riddle to unlock it.',
      },
      { name: 'robots', content: 'noindex' },
    ],
  }),
})

function Page() {
  const { riddle, day } = Route.useLoaderData()
  return <PageRiddle riddle={riddle} day={day} />
}
