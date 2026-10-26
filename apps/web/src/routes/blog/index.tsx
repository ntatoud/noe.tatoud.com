import { createFileRoute } from '@tanstack/react-router'

import { blogPosts } from 'virtual:content'

import { BlogPage } from '@/features/blog/blog-page'
import { toMetaTags } from '@/features/og/metadata'
import { STATIC_PAGES } from '@/lib/site'

export const Route = createFileRoute('/blog/')({
  component: BlogPageRoute,
  head: () => ({ meta: toMetaTags(STATIC_PAGES.blog) }),
})

function BlogPageRoute() {
  return <BlogPage posts={blogPosts} />
}
