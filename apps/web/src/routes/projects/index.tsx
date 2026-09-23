import { createFileRoute } from '@tanstack/react-router'

import { projects } from 'virtual:content'

import { toMetaTags } from '@/features/og/metadata'
import { ProjectsPage } from '@/features/projects/projects-page'
import { STATIC_PAGES } from '@/lib/site'

const PAGE = STATIC_PAGES.projects

export const Route = createFileRoute('/projects/')({
  component: ProjectsPageRoute,
  head: () => ({
    meta: toMetaTags({
      title: PAGE.title,
      description: PAGE.description,
      path: PAGE.path,
    }),
  }),
})

function ProjectsPageRoute() {
  return <ProjectsPage projects={projects} />
}
