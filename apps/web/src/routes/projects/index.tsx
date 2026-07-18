import { createFileRoute } from '@tanstack/react-router'

import { ProjectsPage } from '@/features/projects/projects-page'
import { buildOgMeta } from '@/lib/og-image'
import { getProjects } from '@/server/content'

const TITLE = 'Projects — Noé Tatoud'
const DESCRIPTION = 'Personal and open-source projects.'

export const Route = createFileRoute('/projects/')({
  component: ProjectsPageRoute,
  loader: async () => {
    const projects = await getProjects()
    return { projects }
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      ...buildOgMeta({
        title: TITLE,
        description: DESCRIPTION,
        kind: 'project',
        path: '/projects',
      }),
    ],
  }),
})

function ProjectsPageRoute() {
  const { projects } = Route.useLoaderData()
  return <ProjectsPage projects={projects} />
}
