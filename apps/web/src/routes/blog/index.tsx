import { createFileRoute } from '@tanstack/react-router'

import { blogPosts } from 'virtual:content'

import { BlogPage } from '@/features/blog/blog-page'
import { pageMeta } from '@/features/og/metadata'
import { STATIC_PAGES } from '@/lib/site'

export const Route = createFileRoute('/blog/')({
  component: BlogPageRoute,
  validateSearch: (search: Record<string, unknown>): { tag?: string } =>
    typeof search.tag === 'string' ? { tag: search.tag } : {},
  head: () => ({ meta: pageMeta(STATIC_PAGES.blog.path) }),
})

function BlogPageRoute() {
  const { tag } = Route.useSearch()
  return <BlogPage posts={blogPosts} tag={tag} />
}
