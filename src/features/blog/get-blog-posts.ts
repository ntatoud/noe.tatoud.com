import { createServerFn } from '@tanstack/react-start'
import type { BlogPostFrontmatter } from './schemas'
import { blog } from '@/lib/source'

export type BlogPost = BlogPostFrontmatter & {
  slug: string
  url: string
  hero: string | null
}

export const getBlogPosts = createServerFn({ method: 'GET' }).handler(() =>
  blog
    .getPages()
    .filter((page) => page.data.published)
    .sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
    )
    .map((page) => ({
      slug: page.slugs.join('/'),
      url: page.url,
      title: page.data.title,
      description: page.data.description,
      author: page.data.author,
      date: page.data.date,

      published: page.data.published,
      translations: page.data.translations,
      tags: page.data.tags,
      hero: (page.data._exports.hero as string | undefined) ?? null,
    })),
)
