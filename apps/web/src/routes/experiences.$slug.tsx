import { createFileRoute } from '@tanstack/react-router'

import { ContentError } from '@/components/error/content-error'
import { ExperiencePage } from '@/features/experiences/experience-page'
import { getExperience } from '@/lib/content'

export const Route = createFileRoute('/experiences/$slug')({
  component: ExperiencePageRoute,
  errorComponent: ContentError,
  loader: async ({ params }) => {
    const experience = await getExperience(params.slug)
    return { experience }
  },
})

function ExperiencePageRoute() {
  const { experience } = Route.useLoaderData()
  return <ExperiencePage experience={experience} />
}
