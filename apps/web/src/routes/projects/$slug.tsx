import { createFileRoute } from '@tanstack/react-router'

import { toMetaTags } from '@/features/og/metadata'
import { ProjectPage } from '@/features/projects/project-page'
import { getProject } from '@/server/content'

export const Route = createFileRoute('/projects/$slug')({
  component: ProjectPageRoute,
  loader: async ({ params }) => {
    // See the blog detail route: the server function owns the 404/500 split.
    const project = await getProject({ data: params.slug })
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
