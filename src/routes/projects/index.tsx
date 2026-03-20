import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestUrl } from '@tanstack/react-start/server'
import { getProjects } from '@/features/projects/get-projects'
import { PageProjects } from '@/features/projects/page-projects'
import { ogMeta } from '@/features/og/meta'

const getOrigin = createServerFn({ method: 'GET' }).handler(
  () => getRequestUrl({ xForwardedHost: true }).origin,
)

export const Route = createFileRoute('/projects/')({
  component: PageProjects,
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    return {
      meta: ogMeta({
        title: 'Projects | Noé Tatoud',
        description: 'Open-source projects and contributions by Noé Tatoud.',
        author: 'Noé Tatoud',
        tags: null,
        hero: null,
        url: '/projects/',
        origin: loaderData.origin,
        type: 'website',
      }),
    }
  },
  loader: async () => {
    const [projects, origin] = await Promise.all([getProjects(), getOrigin()])
    return { projects, origin }
  },
})
