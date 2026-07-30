import { createFileRoute, notFound } from '@tanstack/react-router'

import { loadBlogPost } from 'virtual:content'

import { BlogPostPage } from '@/features/blog/blog-post-page'
import { toMetaTags } from '@/features/og/metadata'

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPostPageRoute,
  // One chunk per post, so a page downloads only its own body. An absent slug is
  // the entire 404 check now — no filesystem read, no serverless function. Note
  // the map holds drafts too, matching what reading per request allowed.
  loader: async ({ params }) => {
    const load = loadBlogPost[params.slug]
    if (!load) throw notFound()
    return { post: (await load()).default }
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
