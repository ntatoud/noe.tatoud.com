import { createFileRoute } from '@tanstack/react-router'

import { getBlogPosts } from '@/content-api'
import { BlogPage } from '@/features/blog/blog-page'
import { toMetaTags } from '@/features/og/metadata'

const TITLE = 'Blog | Noé Tatoud'
const DESCRIPTION = 'Articles on software engineering.'

export const Route = createFileRoute('/blog/')({
  component: BlogPageRoute,
  loader: async () => {
    const posts = await getBlogPosts()
    return { posts }
  },
  head: () => ({
    meta: toMetaTags({
      title: TITLE,
      description: DESCRIPTION,
      kind: 'blog',
      path: '/blog',
    }),
  }),
})

function BlogPageRoute() {
  const { posts } = Route.useLoaderData()
  return <BlogPage posts={posts} />
}
