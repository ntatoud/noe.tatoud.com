import { createFileRoute, notFound } from '@tanstack/react-router'

import { ExperiencePage } from '@/features/experiences/experience-page'
import { getExperience } from '@/server/content'

export const Route = createFileRoute('/experiences/$slug')({
  component: ExperiencePageRoute,
  loader: async ({ params }) => {
    const experience = await getExperience({ data: params.slug }).catch(() => {
      throw notFound()
    })
    return { experience }
  },
})

function ExperiencePageRoute() {
  const { experience } = Route.useLoaderData()
  return <ExperiencePage experience={experience} />
}
