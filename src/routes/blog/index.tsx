import { createFileRoute } from '@tanstack/react-router'
import { getBlogPosts } from '@/features/blog/get-blog-posts'
import { PageBlog } from '@/features/blog/page-blog'

export const Route = createFileRoute('/blog/')({
  component: PageBlog,
  loader: () => getBlogPosts(),
})
