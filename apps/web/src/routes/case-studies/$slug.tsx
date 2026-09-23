import { createFileRoute, notFound } from '@tanstack/react-router'

import { loadCaseStudy } from 'virtual:content'

import { CaseStudyPage } from '@/features/case-studies/case-study-page'
import { toMetaTags } from '@/features/og/metadata'

export const Route = createFileRoute('/case-studies/$slug')({
  component: CaseStudyPageRoute,
  loader: async ({ params }) => {
    const load = loadCaseStudy[params.slug]
    if (!load) throw notFound()
    return { caseStudy: (await load()).default }
  },
  head: ({ loaderData, match }) => {
    if (!loaderData) return {}
    const { caseStudy } = loaderData
    return {
      meta: toMetaTags({
        title: caseStudy.title,
        description: caseStudy.description,
        path: match.pathname,
      }),
    }
  },
})

function CaseStudyPageRoute() {
  const { caseStudy } = Route.useLoaderData()
  return <CaseStudyPage caseStudy={caseStudy} />
}
