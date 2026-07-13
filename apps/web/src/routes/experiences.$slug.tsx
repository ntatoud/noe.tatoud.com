import { createFileRoute } from '@tanstack/react-router'

import { ExperiencePage } from '@/features/experiences/experience-page'

export const Route = createFileRoute('/experiences/$slug')({
  component: ExperiencePageRoute,
})

function ExperiencePageRoute() {
  const { slug } = Route.useParams()
  return <ExperiencePage slug={slug} />
}
