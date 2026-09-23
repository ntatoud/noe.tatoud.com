import { createFileRoute } from '@tanstack/react-router'

import { blogPosts } from 'virtual:content'

import { BlogPage } from '@/features/blog/blog-page'
import { toMetaTags } from '@/features/og/metadata'
import { STATIC_PAGES } from '@/lib/site'

const PAGE = STATIC_PAGES.blog

export const Route = createFileRoute('/blog/')({
  component: BlogPageRoute,
  head: () => ({
    meta: toMetaTags({
      title: PAGE.title,
      description: PAGE.description,
      path: PAGE.path,
    }),
  }),
})

function BlogPageRoute() {
  return <BlogPage posts={blogPosts} />
}
