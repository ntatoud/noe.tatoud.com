import { createFileRoute, notFound } from '@tanstack/react-router'

import { toMetaTags } from '@/features/og/metadata'
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
  head: ({ loaderData, match }) => {
    if (!loaderData) return {}
    const { talk } = loaderData
    return {
      meta: toMetaTags({
        title: talk.title,
        description: talk.description,
        kind: 'talk',
        path: match.pathname,
      }),
    }
  },
})

function TalkPageRoute() {
  const { talk } = Route.useLoaderData()
  return <TalkPage talk={talk} />
}
