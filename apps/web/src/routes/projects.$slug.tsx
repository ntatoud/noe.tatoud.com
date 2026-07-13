import { createFileRoute } from '@tanstack/react-router'

import { ProjectPage } from '@/features/projects/project-page'

export const Route = createFileRoute('/projects/$slug')({
  component: ProjectPageRoute,
})

function ProjectPageRoute() {
  const { slug } = Route.useParams()
  return <ProjectPage slug={slug} />
}
