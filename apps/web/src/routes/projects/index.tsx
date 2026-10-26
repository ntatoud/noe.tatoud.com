import { createFileRoute } from '@tanstack/react-router'

import { projects } from 'virtual:content'

import { toMetaTags } from '@/features/og/metadata'
import { ProjectsPage } from '@/features/projects/projects-page'
import { STATIC_PAGES } from '@/lib/site'

export const Route = createFileRoute('/projects/')({
  component: ProjectsPageRoute,
  head: () => ({ meta: toMetaTags(STATIC_PAGES.projects) }),
})

function ProjectsPageRoute() {
  return <ProjectsPage projects={projects} />
}
