import { createFileRoute } from '@tanstack/react-router'

import { TalkPage } from '@/features/talks/talk-page'

export const Route = createFileRoute('/talks/$slug')({
  component: TalkPageRoute,
})

function TalkPageRoute() {
  const { slug } = Route.useParams()
  return <TalkPage slug={slug} />
}
