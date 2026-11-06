import { createFileRoute } from '@tanstack/react-router'

import { blogPosts, loadTalk, talks } from 'virtual:content'

import { relatedPosts } from '@/features/blog/related-posts'
import { pageMeta } from '@/features/og/metadata'
import { TalkPage } from '@/features/talks/talk-page'
import { loadDocument } from '@/lib/load-document'

export const Route = createFileRoute('/talks/$slug')({
  component: TalkPageRoute,
  loader: async ({ params }) => ({
    talk: await loadDocument(loadTalk, params.slug),
  }),
  head: ({ match }) => ({ meta: pageMeta(match.pathname) }),
})

function TalkPageRoute() {
  const { talk } = Route.useLoaderData()
  const moreTalks = talks
    .filter((other) => other.slug !== talk.slug)
    .slice(0, 2)
  const writing = relatedPosts(talk, blogPosts, 2, { requireOverlap: true })
  return <TalkPage talk={talk} moreTalks={moreTalks} relatedWriting={writing} />
}
