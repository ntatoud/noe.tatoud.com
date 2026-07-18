import { createFileRoute, notFound } from '@tanstack/react-router'

import { ProjectPage } from '@/features/projects/project-page'
import { buildOgMeta } from '@/lib/og-image'
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
      meta: [
        { title: project.title },
        ...(project.description
          ? [{ name: 'description', content: project.description }]
          : []),
        ...buildOgMeta({
          title: project.title,
          description: project.description,
          kind: 'project',
          path: match.pathname,
        }),
      ],
    }
  },
})

function ProjectPageRoute() {
  const { project } = Route.useLoaderData()
  return <ProjectPage project={project} />
}
