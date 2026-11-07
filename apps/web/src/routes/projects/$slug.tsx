import { createFileRoute } from '@tanstack/react-router'

import { loadProject, projects } from 'virtual:content'

import { pageMeta } from '@/features/og/metadata'
import { ProjectPage } from '@/features/projects/project-page'
import { loadDocument } from '@/lib/load-document'
import { others } from '@/lib/more'

export const Route = createFileRoute('/projects/$slug')({
  component: ProjectPageRoute,
  loader: async ({ params }) => ({
    project: await loadDocument(loadProject, params.slug),
  }),
  head: ({ match }) => ({ meta: pageMeta(match.pathname) }),
})

function ProjectPageRoute() {
  const { project } = Route.useLoaderData()
  return (
    <ProjectPage
      project={project}
      moreProjects={others(projects, project.slug)}
    />
  )
}
