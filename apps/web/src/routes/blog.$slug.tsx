import { createFileRoute } from '@tanstack/react-router'

import { BlogPostPage } from '@/features/blog/blog-post-page'

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPostPageRoute,
})

function BlogPostPageRoute() {
  const { slug } = Route.useParams()
  return <BlogPostPage slug={slug} />
}
