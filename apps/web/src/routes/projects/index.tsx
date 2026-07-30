import { createFileRoute } from '@tanstack/react-router'

import { projects } from 'virtual:content'

import { toMetaTags } from '@/features/og/metadata'
import { ProjectsPage } from '@/features/projects/projects-page'

const TITLE = 'Projects | Noé Tatoud'
const DESCRIPTION = 'Personal and open-source projects.'

export const Route = createFileRoute('/projects/')({
  component: ProjectsPageRoute,
  head: () => ({
    meta: toMetaTags({
      title: TITLE,
      description: DESCRIPTION,
      kind: 'project',
      path: '/projects',
    }),
  }),
})

function ProjectsPageRoute() {
  return <ProjectsPage projects={projects} />
}
