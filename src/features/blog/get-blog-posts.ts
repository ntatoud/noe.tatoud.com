import { createServerFn } from '@tanstack/react-start'

import { allBlogPosts } from 'content-collections'

import { resolveContentImage } from '@/lib/content-images'

export type BlogPost = {
  slug: string
  url: string
  title: string
  description: string | undefined
  author: string
  date: string
  published: boolean
  translations: Array<{ lang: string; url: string }> | undefined
  tags: Array<string> | undefined
  externalUrl: string | null
  hero: string | null
}

export const getBlogPosts = createServerFn({ method: 'GET' }).handler(() =>
  allBlogPosts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((post) => ({
      slug: post._meta.path,
      url: `/blog/${post._meta.path}`,
      title: post.title,
      description: post.description,
      author: post.author,
      date: post.date,
      published: post.published,
      translations: post.translations,
      tags: post.tags,
      externalUrl: post.externalUrl ?? null,
      hero: resolveContentImage(
        `content/blog/${post._meta.directory}`,
        post.hero,
      ),
    })),
)
