import { createFileRoute, notFound } from '@tanstack/react-router'

import { TalkPage } from '@/features/talks/talk-page'
import { getTalk } from '@/server/content'

export const Route = createFileRoute('/talks/$slug')({
  component: TalkPageRoute,
  loader: async ({ params }) => {
    const talk = await getTalk({ data: params.slug }).catch(() => {
      throw notFound()
    })
    return { talk }
  },
})

function TalkPageRoute() {
  const { talk } = Route.useLoaderData()
  return <TalkPage talk={talk} />
}
