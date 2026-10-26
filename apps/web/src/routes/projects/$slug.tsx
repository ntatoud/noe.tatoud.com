import { createFileRoute } from '@tanstack/react-router'

import { loadProject } from 'virtual:content'

import { toMetaTags } from '@/features/og/metadata'
import { ProjectPage } from '@/features/projects/project-page'
import { loadDocument } from '@/lib/load-document'

export const Route = createFileRoute('/projects/$slug')({
  component: ProjectPageRoute,
  loader: async ({ params }) => ({
    project: await loadDocument(loadProject, params.slug),
  }),
  head: ({ loaderData, match }) => {
    if (!loaderData) return {}
    const { project } = loaderData
    return {
      meta: toMetaTags({
        title: project.title,
        description: project.description,
        path: match.pathname,
      }),
    }
  },
})

function ProjectPageRoute() {
  const { project } = Route.useLoaderData()
  return <ProjectPage project={project} />
}
