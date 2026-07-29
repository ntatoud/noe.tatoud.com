import { createFileRoute } from '@tanstack/react-router'

import { getBlogPost } from '@/content-api'
import { BlogPostPage } from '@/features/blog/blog-post-page'
import { toMetaTags } from '@/features/og/metadata'

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPostPageRoute,
  loader: async ({ params }) => {
    // No catch here on purpose: `getBlogPost` already answers a missing post
    // with a 404 and lets every other failure through as a 500, so swallowing
    // errors at this level would hide real bugs behind "not found".
    const post = await getBlogPost(params.slug)
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
