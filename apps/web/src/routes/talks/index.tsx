import { createFileRoute } from '@tanstack/react-router'

import { talks } from 'virtual:content'

import { pageMeta } from '@/features/og/metadata'
import { TalksPage } from '@/features/talks/talks-page'

export const Route = createFileRoute('/talks/')({
  component: TalksPageRoute,
  head: () => ({ meta: pageMeta('/talks') }),
})

function TalksPageRoute() {
  return <TalksPage talks={talks} />
}
