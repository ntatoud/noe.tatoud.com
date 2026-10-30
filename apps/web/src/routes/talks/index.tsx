import { createFileRoute } from '@tanstack/react-router'

import { talks } from 'virtual:content'

import { pageMeta } from '@/features/og/metadata'
import { TalksPage } from '@/features/talks/talks-page'
import { STATIC_PAGES } from '@/lib/site'

export const Route = createFileRoute('/talks/')({
  component: TalksPageRoute,
  head: () => ({ meta: pageMeta(STATIC_PAGES.talks.path) }),
})

function TalksPageRoute() {
  return <TalksPage talks={talks} />
}
