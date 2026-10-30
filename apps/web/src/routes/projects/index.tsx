import { createFileRoute } from '@tanstack/react-router'

import { projects } from 'virtual:content'

import { pageMeta } from '@/features/og/metadata'
import { ProjectsPage } from '@/features/projects/projects-page'
import { STATIC_PAGES } from '@/lib/site'

export const Route = createFileRoute('/projects/')({
  component: ProjectsPageRoute,
  head: () => ({ meta: pageMeta(STATIC_PAGES.projects.path) }),
})

function ProjectsPageRoute() {
  return <ProjectsPage projects={projects} />
}
