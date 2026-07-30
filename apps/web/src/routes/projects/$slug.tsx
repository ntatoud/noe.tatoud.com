import { createFileRoute, notFound } from '@tanstack/react-router'

import { loadProject } from 'virtual:content'

import { toMetaTags } from '@/features/og/metadata'
import { ProjectPage } from '@/features/projects/project-page'

export const Route = createFileRoute('/projects/$slug')({
  component: ProjectPageRoute,
  // See the blog detail route.
  loader: async ({ params }) => {
    const load = loadProject[params.slug]
    if (!load) throw notFound()
    return { project: (await load()).default }
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
