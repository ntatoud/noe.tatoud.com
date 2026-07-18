import { createFileRoute } from '@tanstack/react-router'

import { toMetaTags } from '@/features/og/metadata'
import { TalksPage } from '@/features/talks/talks-page'
import { getTalks } from '@/server/content'

const TITLE = 'Talks | Noé Tatoud'
const DESCRIPTION = 'Conference talks and workshops.'

export const Route = createFileRoute('/talks/')({
  component: TalksPageRoute,
  loader: async () => {
    const talks = await getTalks()
    return { talks }
  },
  head: () => ({
    meta: toMetaTags({
      title: TITLE,
      description: DESCRIPTION,
      kind: 'talk',
      path: '/talks',
    }),
  }),
})

function TalksPageRoute() {
  const { talks } = Route.useLoaderData()
  return <TalksPage talks={talks} />
}
