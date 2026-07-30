import { createFileRoute } from '@tanstack/react-router'

import { projects } from 'virtual:content'

import { toMetaTags } from '@/features/og/metadata'
import { ProjectsPage } from '@/features/projects/projects-page'
import { PAGE_DESCRIPTIONS } from '@/lib/site'

const TITLE = 'Projects | Noé Tatoud'
const DESCRIPTION = PAGE_DESCRIPTIONS.projects

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
