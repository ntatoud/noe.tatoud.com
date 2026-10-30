import { createFileRoute } from '@tanstack/react-router'

import { blogPosts } from 'virtual:content'

import { BlogPage } from '@/features/blog/blog-page'
import { pageMeta } from '@/features/og/metadata'

export const Route = createFileRoute('/blog/')({
  component: BlogPageRoute,
  head: () => ({ meta: pageMeta('/blog') }),
})

function BlogPageRoute() {
  return <BlogPage posts={blogPosts} />
}
