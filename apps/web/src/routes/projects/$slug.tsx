import { createFileRoute, notFound } from '@tanstack/react-router'

import { toMetaTags } from '@/features/og/metadata'
import { ProjectPage } from '@/features/projects/project-page'
import { getProject } from '@/server/content'

export const Route = createFileRoute('/projects/$slug')({
  component: ProjectPageRoute,
  loader: async ({ params }) => {
    const project = await getProject({ data: params.slug }).catch(() => {
      throw notFound()
    })
    return { project }
  },
  head: ({ loaderData, match }) => {
    if (!loaderData) return {}
    const { project } = loaderData
    return {
      meta: toMetaTags({
        title: project.title,
        description: project.description,
        kind: 'project',
        path: match.pathname,
      }),
    }
  },
})

function ProjectPageRoute() {
  const { project } = Route.useLoaderData()
  return <ProjectPage project={project} />
}
