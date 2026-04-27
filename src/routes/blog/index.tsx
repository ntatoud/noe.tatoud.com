import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestUrl } from '@tanstack/react-start/server'

import { getBlogPosts } from '@/features/blog/get-blog-posts'
import { PageBlog } from '@/features/blog/page-blog'
import { canonicalLink, ogMeta } from '@/features/og/meta'

const getOrigin = createServerFn({ method: 'GET' }).handler(
  () => getRequestUrl({ xForwardedHost: true }).origin,
)

export const Route = createFileRoute('/blog/')({
  component: PageBlog,
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    return {
      links: [canonicalLink('/blog/', loaderData.origin)],
      meta: ogMeta({
        title: 'Blog | Noé Tatoud',
        description:
          'Articles about frontend development, design, and technology by Noé Tatoud.',
        author: 'Noé Tatoud',
        tags: null,
        hero: null,
        url: '/blog/',
        origin: loaderData.origin,
        type: 'website',
      }),
    }
  },
  loader: async () => {
    const [posts, origin] = await Promise.all([getBlogPosts(), getOrigin()])
    return { posts, origin }
  },
})
