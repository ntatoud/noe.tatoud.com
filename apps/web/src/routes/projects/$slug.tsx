import { createFileRoute, notFound } from '@tanstack/react-router'

import { ProjectPage } from '@/features/projects/project-page'
import { getProject } from '@/server/content'

export const Route = createFileRoute('/projects/$slug')({
  component: ProjectPageRoute,
  loader: async ({ params }) => {
    const project = await getProject({ data: params.slug }).catch(() => {
      throw notFound()
    })
    return { project }
  },
})

function ProjectPageRoute() {
  const { project } = Route.useLoaderData()
  return <ProjectPage project={project} />
}
