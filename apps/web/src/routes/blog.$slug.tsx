import { createFileRoute } from '@tanstack/react-router'

import { ContentError } from '@/components/error/content-error'
import { BlogPostPage } from '@/features/blog/blog-post-page'
import { getBlogPost } from '@/lib/content'

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPostPageRoute,
  errorComponent: ContentError,
  loader: async ({ params }) => {
    const post = await getBlogPost(params.slug)
    return { post }
  },
})

function BlogPostPageRoute() {
  const { post } = Route.useLoaderData()
  return <BlogPostPage post={post} />
}
