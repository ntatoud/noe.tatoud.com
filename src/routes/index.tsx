import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestUrl } from '@tanstack/react-start/server'
import type { Person, WebSite } from 'schema-dts'
import { PageHome } from '@/features/home/page-home'
import { getBlogPosts } from '@/features/blog/get-blog-posts'
import { getProjects } from '@/features/projects/get-projects'
import { ogMeta } from '@/features/og/meta'
import { jsonLd } from '@/lib/json-ld'
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
        jsonLd<Person>({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Noé Tatoud',
          url: homeUrl,
          jobTitle: 'Frontend Developer',
        }),
        jsonLd<WebSite>({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Noé Tatoud',
          url: homeUrl,
        }),
      ],
    }
  },
  loader: async () => {
    const [posts, projects, origin] = await Promise.all([
      getBlogPosts(),
      getProjects(),
      getOrigin(),
    ])
    return { posts, projects, origin }
  },
})

function App() {
  return <PageHome />
}
