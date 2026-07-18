import { createFileRoute } from '@tanstack/react-router'

import { BlogPage } from '@/features/blog/blog-page'
import { buildOgMeta } from '@/lib/og-image'
import { getBlogPosts } from '@/server/content'

const TITLE = 'Blog — Noé Tatoud'
const DESCRIPTION = 'Articles on software engineering.'

export const Route = createFileRoute('/blog/')({
  component: BlogPageRoute,
  loader: async () => {
    const posts = await getBlogPosts()
    return { posts }
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      ...buildOgMeta({
        title: TITLE,
        description: DESCRIPTION,
        kind: 'blog',
        path: '/blog',
      }),
    ],
  }),
})

function BlogPageRoute() {
  const { posts } = Route.useLoaderData()
  return <BlogPage posts={posts} />
}
