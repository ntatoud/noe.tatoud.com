import { createFileRoute } from '@tanstack/react-router'

import { loadBlogPost } from 'virtual:content'

import { BlogPostPage } from '@/features/blog/blog-post-page'
import { toMetaTags } from '@/features/og/metadata'
import { loadDocument } from '@/lib/load-document'

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPostPageRoute,
  loader: async ({ params }) => ({
    post: await loadDocument(loadBlogPost, params.slug),
  }),
  head: ({ loaderData, match }) => {
    if (!loaderData) return {}
    const { post } = loaderData
    return {
      meta: toMetaTags({
        title: post.title,
        description: post.description,
        path: match.pathname,
      }),
    }
  },
})

function BlogPostPageRoute() {
  const { post } = Route.useLoaderData()
  return <BlogPostPage post={post} />
}
