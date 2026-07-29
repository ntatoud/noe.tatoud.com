import { createFileRoute } from '@tanstack/react-router'

import { toMetaTags } from '@/features/og/metadata'
import { TalkPage } from '@/features/talks/talk-page'
import { getTalk } from '@/server/content'

export const Route = createFileRoute('/talks/$slug')({
  component: TalkPageRoute,
  loader: async ({ params }) => {
    // See the blog detail route: the server function owns the 404/500 split.
    const talk = await getTalk({ data: params.slug })
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
