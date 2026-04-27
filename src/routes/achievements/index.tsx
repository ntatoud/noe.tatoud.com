import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestUrl } from '@tanstack/react-start/server'

import { PageAchievements } from '@/features/achievements/page-achievements'
import { getBlogPosts } from '@/features/blog/get-blog-posts'
import { canonicalLink, ogMeta } from '@/features/og/meta'

const getOrigin = createServerFn({ method: 'GET' }).handler(
  () => getRequestUrl({ xForwardedHost: true }).origin,
)

export const Route = createFileRoute('/achievements/')({
  loader: async () => {
    const [posts, origin] = await Promise.all([getBlogPosts(), getOrigin()])
    return { totalBlogPosts: posts.length, origin }
  },
  component: PageAchievements,
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    return {
      links: [canonicalLink('/achievements/', loaderData.origin)],
      meta: ogMeta({
        title: 'Achievements | Noé Tatoud',
        description:
          'Unlock achievements by exploring the site. How many can you find?',
        author: 'Noé Tatoud',
        tags: null,
        hero: null,
        url: '/achievements/',
        origin: loaderData.origin,
        type: 'website',
      }),
    }
  },
})
