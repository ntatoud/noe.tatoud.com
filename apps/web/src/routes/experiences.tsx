import { createFileRoute } from '@tanstack/react-router'

import { ExperiencesPage } from '@/features/experiences/experiences-page'
import { getExperiences } from '@/lib/content'

export const Route = createFileRoute('/experiences')({
  component: ExperiencesPageRoute,
  loader: async () => {
    const experiences = await getExperiences()
    return { experiences }
  },
})

function ExperiencesPageRoute() {
  const { experiences } = Route.useLoaderData()
  return <ExperiencesPage experiences={experiences} />
}
