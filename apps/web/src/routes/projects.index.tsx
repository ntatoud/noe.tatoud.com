import { createFileRoute } from '@tanstack/react-router'

import { ProjectsPage } from '@/features/projects/projects-page'
import { getProjects } from '@/lib/content'

export const Route = createFileRoute('/projects/')({
  component: ProjectsPageRoute,
  loader: async () => {
    const projects = await getProjects()
    return { projects }
  },
})

function ProjectsPageRoute() {
  const { projects } = Route.useLoaderData()
  return <ProjectsPage projects={projects} />
}
