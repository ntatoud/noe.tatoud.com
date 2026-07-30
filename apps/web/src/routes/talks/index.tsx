import { createFileRoute } from '@tanstack/react-router'

import { talks } from 'virtual:content'

import { toMetaTags } from '@/features/og/metadata'
import { TalksPage } from '@/features/talks/talks-page'
import { PAGE_DESCRIPTIONS } from '@/lib/site'

const TITLE = 'Talks | Noé Tatoud'
const DESCRIPTION = PAGE_DESCRIPTIONS.talks

export const Route = createFileRoute('/talks/')({
  component: TalksPageRoute,
  head: () => ({
    meta: toMetaTags({
      title: TITLE,
      description: DESCRIPTION,
      kind: 'talk',
      path: '/talks',
    }),
  }),
})

function TalksPageRoute() {
  return <TalksPage talks={talks} />
}
