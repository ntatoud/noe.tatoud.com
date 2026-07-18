import { createFileRoute } from '@tanstack/react-router'

import { ExperiencesPage } from '@/features/experiences/experiences-page'
import { buildOgMeta } from '@/lib/og-image'
import { getExperiences } from '@/server/content'

const TITLE = 'Experiences — Noé Tatoud'
const DESCRIPTION = 'Work, volunteer, and education history.'

export const Route = createFileRoute('/experiences/')({
  component: ExperiencesPageRoute,
  loader: async () => {
    const experiences = await getExperiences()
    return { experiences }
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      ...buildOgMeta({
        title: TITLE,
        description: DESCRIPTION,
        kind: 'experience',
        path: '/experiences',
      }),
    ],
  }),
})

function ExperiencesPageRoute() {
  const { experiences } = Route.useLoaderData()
  return <ExperiencesPage experiences={experiences} />
}
