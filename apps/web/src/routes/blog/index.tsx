import { createFileRoute } from '@tanstack/react-router'

import { blogPosts } from 'virtual:content'

import { BlogPage } from '@/features/blog/blog-page'
import { pageMeta } from '@/features/og/metadata'
import { STATIC_PAGES } from '@/lib/site'

export const Route = createFileRoute('/blog/')({
  component: BlogPageRoute,
  head: () => ({ meta: pageMeta(STATIC_PAGES.blog.path) }),
})

function BlogPageRoute() {
  return <BlogPage posts={blogPosts} />
}
