import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestUrl } from '@tanstack/react-start/server'

import type { Person, WebSite } from 'schema-dts'

import { getBlogPosts } from '@/features/blog/get-blog-posts'
import { getExperiences } from '@/features/experiences/get-experiences'
import { PageHome } from '@/features/home/page-home'
import { canonicalLink, ogMeta } from '@/features/og/meta'
import { getProjects } from '@/features/projects/get-projects'
import { jsonLd } from '@/lib/json-ld'
import { siteUrl } from '@/lib/site'

const HOME_LINK_HEADER =
  '</llms.txt>; rel="describedby"; type="text/plain", </sitemap.xml>; rel="sitemap"; type="application/xml"'

const getOrigin = createServerFn({ method: 'GET' }).handler(
  () => getRequestUrl({ xForwardedHost: true }).origin,
)

export const Route = createFileRoute('/')({
  component: App,
  headers: () => ({
    Link: HOME_LINK_HEADER,
  }),
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const homeUrl = siteUrl(loaderData.origin, '/')
    return {
      links: [canonicalLink('/', loaderData.origin)],
      meta: [
        ...ogMeta({
          title: 'Noé Tatoud | Frontend Developer',
          description:
            'Personal website and blog of Noé Tatoud, a frontend developer.',
          author: 'Noé Tatoud',
          tags: null,
          hero: null,
          avatar: '/pixel-avatar.png',
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
    const [posts, projects, experiences, origin] = await Promise.all([
      getBlogPosts(),
      getProjects(),
      getExperiences(),
      getOrigin(),
    ])
    return { posts, projects, experiences, origin }
  },
})

function App() {
  return <PageHome />
}
