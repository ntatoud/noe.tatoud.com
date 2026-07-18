import { createFileRoute, notFound } from '@tanstack/react-router'

import { ExperiencePage } from '@/features/experiences/experience-page'
import { toMetaTags } from '@/features/og/metadata'
import { getExperience } from '@/server/content'

export const Route = createFileRoute('/experiences/$slug')({
  component: ExperiencePageRoute,
  loader: async ({ params }) => {
    const experience = await getExperience({ data: params.slug }).catch(() => {
      throw notFound()
    })
    return { experience }
  },
  head: ({ loaderData, match }) => {
    if (!loaderData) return {}
    const { experience } = loaderData
    return {
      meta: toMetaTags({
        title: experience.title,
        description: experience.organization,
        kind: 'experience',
        path: match.pathname,
      }),
    }
  },
})

function ExperiencePageRoute() {
  const { experience } = Route.useLoaderData()
  return <ExperiencePage experience={experience} />
}
