import { getTalks } from '@ntatoud/content'
import { createFileRoute } from '@tanstack/react-router'

import { TalksPage } from '@/features/talks/talks-page'

export const Route = createFileRoute('/talks')({
  component: TalksPageRoute,
  loader: async () => {
    const talks = await getTalks()
    return { talks }
  },
})

function TalksPageRoute() {
  const { talks } = Route.useLoaderData()
  return <TalksPage talks={talks} />
}
