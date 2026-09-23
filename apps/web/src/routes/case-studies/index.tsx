import { createFileRoute } from '@tanstack/react-router'

import { caseStudies } from 'virtual:content'

import { CaseStudiesPage } from '@/features/case-studies/case-studies-page'
import { toMetaTags } from '@/features/og/metadata'
import { STATIC_PAGES } from '@/lib/site'

const PAGE = STATIC_PAGES.caseStudies

export const Route = createFileRoute('/case-studies/')({
  component: CaseStudiesPageRoute,
  head: () => ({
    meta: toMetaTags({
      title: PAGE.title,
      description: PAGE.description,
      path: PAGE.path,
    }),
  }),
})

function CaseStudiesPageRoute() {
  return <CaseStudiesPage caseStudies={caseStudies} />
}
