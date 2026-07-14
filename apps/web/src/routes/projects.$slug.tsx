import { createFileRoute } from '@tanstack/react-router'

import { ContentError } from '@/components/error/content-error'
import { ProjectPage } from '@/features/projects/project-page'
import { getProject } from '@/lib/content'

export const Route = createFileRoute('/projects/$slug')({
  component: ProjectPageRoute,
  errorComponent: ContentError,
  loader: async ({ params }) => {
    const project = await getProject(params.slug)
    return { project }
  },
})

function ProjectPageRoute() {
  const { project } = Route.useLoaderData()
  return <ProjectPage project={project} />
}
