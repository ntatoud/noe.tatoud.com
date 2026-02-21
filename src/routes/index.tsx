import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestUrl } from '@tanstack/react-start/server'
import { PageHome } from '@/features/home/page-home'
import { getBlogPosts } from '@/features/blog/get-blog-posts'
import { getProjects } from '@/features/projects/get-projects'
import { getEvents } from '@/features/events/get-events'
import { ogMeta } from '@/features/og/meta'
import { siteUrl } from '@/lib/site'

const getOrigin = createServerFn({ method: 'GET' }).handler(
  () => getRequestUrl({ xForwardedHost: true }).origin,
)

export const Route = createFileRoute('/')({
  component: App,
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const homeUrl = siteUrl(loaderData.origin, '/')
    return {
      meta: [
        ...ogMeta({
          title: 'Noé Tatoud — Frontend Developer',
          description:
            'Personal website and blog of Noé Tatoud, a frontend developer.',
          author: 'Noé Tatoud',
          tags: null,
          hero: null,
          url: '/',
          origin: loaderData.origin,
          type: 'website',
        }),
        {
          'script:ld+json': {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Noé Tatoud',
            url: homeUrl,
            jobTitle: 'Frontend Developer',
          },
        } as never,
        {
          'script:ld+json': {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Noé Tatoud',
            url: homeUrl,
          },
        } as never,
      ],
    }
  },
  loader: async () => {
    const [posts, projects, events, origin] = await Promise.all([
      getBlogPosts(),
      getProjects(),
      getEvents(),
      getOrigin(),
    ])
    return { posts, projects, events, origin }
  },
})

function App() {
  return <PageHome />
}
