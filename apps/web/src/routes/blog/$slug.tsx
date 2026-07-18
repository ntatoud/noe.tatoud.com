import { createFileRoute, notFound } from '@tanstack/react-router'

import { BlogPostPage } from '@/features/blog/blog-post-page'
import { toMetaTags } from '@/features/og/metadata'
import { getBlogPost } from '@/server/content'

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPostPageRoute,
  loader: async ({ params }) => {
    const post = await getBlogPost({ data: params.slug }).catch(() => {
      throw notFound()
    })
    return { post }
  },
  head: ({ loaderData, match }) => {
    if (!loaderData) return {}
    const { post } = loaderData
    return {
      meta: toMetaTags({
        title: post.title,
        description: post.description,
        kind: 'blog',
        path: match.pathname,
      }),
    }
  },
})

function BlogPostPageRoute() {
  const { post } = Route.useLoaderData()
  return <BlogPostPage post={post} />
}
