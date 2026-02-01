import { createServerFn } from '@tanstack/react-start'
import { blog } from '@/lib/source'

export type BlogPost = Awaited<ReturnType<typeof getBlogPosts>>['0']
export const getBlogPosts = createServerFn({
  method: 'GET',
}).handler(() => {
  const pages = blog.getPages()
  return pages.map((page) => ({
    slug: page.slugs.join('/'),
    url: page.url,
    title: page.data.title,
    description: page.data.description,
    author: page.data.author,
    date: page.data.date,
  }))
})
