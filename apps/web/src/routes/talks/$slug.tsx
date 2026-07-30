import { createFileRoute, notFound } from '@tanstack/react-router'

import { loadTalk } from 'virtual:content'

import { toMetaTags } from '@/features/og/metadata'
import { TalkPage } from '@/features/talks/talk-page'

export const Route = createFileRoute('/talks/$slug')({
  component: TalkPageRoute,
  loader: async ({ params }) => {
    const load = loadTalk[params.slug]
    if (!load) throw notFound()
    return { talk: (await load()).default }
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
