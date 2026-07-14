import { createFileRoute } from '@tanstack/react-router'

import { BlogPage } from '@/features/blog/blog-page'
import { getBlogPosts } from '@/lib/content'

export const Route = createFileRoute('/blog')({
  component: BlogPageRoute,
  loader: async () => {
    const posts = await getBlogPosts()
    return { posts }
  },
})

function BlogPageRoute() {
  const { posts } = Route.useLoaderData()
  return <BlogPage posts={posts} />
}
