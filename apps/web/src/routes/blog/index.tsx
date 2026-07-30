import { createFileRoute } from '@tanstack/react-router'

import { blogPosts } from 'virtual:content'

import { BlogPage } from '@/features/blog/blog-page'
import { toMetaTags } from '@/features/og/metadata'

const TITLE = 'Blog | Noé Tatoud'
const DESCRIPTION = 'Articles on software engineering.'

// No loader: the listing is a build-time constant from `virtual:content`, so it
// already ships in the bundle. Returning it from a loader would additionally
// serialize it into the SSR payload, sending the same data twice.
export const Route = createFileRoute('/blog/')({
  component: BlogPageRoute,
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
  return <BlogPage posts={blogPosts} />
}
