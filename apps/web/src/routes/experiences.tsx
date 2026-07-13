import { getExperiences } from '@ntatoud/content'
import { createFileRoute } from '@tanstack/react-router'

import { ExperiencesPage } from '@/features/experiences/experiences-page'

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
