import { createFileRoute, notFound } from '@tanstack/react-router'

import { TalkPage } from '@/features/talks/talk-page'
import { buildOgMeta } from '@/lib/og-image'
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
      meta: [
        { title: talk.title },
        { name: 'description', content: talk.description },
        ...buildOgMeta({
          title: talk.title,
          description: talk.description,
          kind: 'talk',
          path: match.pathname,
        }),
      ],
    }
  },
})

function TalkPageRoute() {
  const { talk } = Route.useLoaderData()
  return <TalkPage talk={talk} />
}
