import { createFileRoute } from '@tanstack/react-router'

import { loadTalk } from 'virtual:content'

import { toMetaTags } from '@/features/og/metadata'
import { TalkPage } from '@/features/talks/talk-page'
import { loadDocument } from '@/lib/load-document'

export const Route = createFileRoute('/talks/$slug')({
  component: TalkPageRoute,
  loader: async ({ params }) => ({
    talk: await loadDocument(loadTalk, params.slug),
  }),
  head: ({ loaderData, match }) => {
    if (!loaderData) return {}
    const { talk } = loaderData
    return {
      meta: toMetaTags({
        title: talk.title,
        description: talk.description,
        path: match.pathname,
      }),
    }
  },
})

function TalkPageRoute() {
  const { talk } = Route.useLoaderData()
  return <TalkPage talk={talk} />
}
