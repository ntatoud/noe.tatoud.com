import { createFileRoute } from '@tanstack/react-router'

import { projects } from 'virtual:content'

import { pageMeta } from '@/features/og/metadata'
import { ProjectsPage } from '@/features/projects/projects-page'

export const Route = createFileRoute('/projects/')({
  component: ProjectsPageRoute,
  head: () => ({ meta: pageMeta('/projects') }),
})

function ProjectsPageRoute() {
  return <ProjectsPage projects={projects} />
}
