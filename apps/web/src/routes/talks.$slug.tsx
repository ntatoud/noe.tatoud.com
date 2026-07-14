import { createFileRoute } from '@tanstack/react-router'

import { ContentError } from '@/components/error/content-error'
import { TalkPage } from '@/features/talks/talk-page'
import { getTalk } from '@/lib/content'

export const Route = createFileRoute('/talks/$slug')({
  component: TalkPageRoute,
  errorComponent: ContentError,
  loader: async ({ params }) => {
    const talk = await getTalk(params.slug)
    return { talk }
  },
})

function TalkPageRoute() {
  const { talk } = Route.useLoaderData()
  return <TalkPage talk={talk} />
}
