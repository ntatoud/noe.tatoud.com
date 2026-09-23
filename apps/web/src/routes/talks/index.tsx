import { createFileRoute } from '@tanstack/react-router'

import { talks } from 'virtual:content'

import { toMetaTags } from '@/features/og/metadata'
import { TalksPage } from '@/features/talks/talks-page'
import { STATIC_PAGES } from '@/lib/site'

const PAGE = STATIC_PAGES.talks

export const Route = createFileRoute('/talks/')({
  component: TalksPageRoute,
  head: () => ({
    meta: toMetaTags({
      title: PAGE.title,
      description: PAGE.description,
      path: PAGE.path,
    }),
  }),
})

function TalksPageRoute() {
  return <TalksPage talks={talks} />
}
