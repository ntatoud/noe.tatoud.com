import { createFileRoute, notFound } from '@tanstack/react-router'

import { BlogPostPage } from '@/features/blog/blog-post-page'
import { getBlogPost } from '@/server/content'

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPostPageRoute,
  loader: async ({ params }) => {
    const post = await getBlogPost({ data: params.slug }).catch(() => {
      throw notFound()
    })
    return { post }
  },
})

function BlogPostPageRoute() {
  const { post } = Route.useLoaderData()
  return <BlogPostPage post={post} />
}
