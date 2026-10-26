import { createFileRoute } from '@tanstack/react-router'

import { talks } from 'virtual:content'

import { toMetaTags } from '@/features/og/metadata'
import { TalksPage } from '@/features/talks/talks-page'
import { STATIC_PAGES } from '@/lib/site'

export const Route = createFileRoute('/talks/')({
  component: TalksPageRoute,
  head: () => ({ meta: toMetaTags(STATIC_PAGES.talks) }),
})

function TalksPageRoute() {
  return <TalksPage talks={talks} />
}
