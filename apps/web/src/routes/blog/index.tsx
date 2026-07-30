import { createFileRoute } from '@tanstack/react-router'

import { blogPosts } from 'virtual:content'

import { BlogPage } from '@/features/blog/blog-page'
import { toMetaTags } from '@/features/og/metadata'
import { PAGE_DESCRIPTIONS } from '@/lib/site'

const TITLE = 'Blog | Noé Tatoud'
const DESCRIPTION = PAGE_DESCRIPTIONS.blog

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
