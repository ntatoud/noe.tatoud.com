import { allBlogPosts } from 'content-collections'

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
  heroDimensions: { width: number; height: number } | null
}

/** Resolves a hero frontmatter path to a content-root-relative URL path. */
function resolveHeroPath(directory: string, hero: string): string {
  const cleaned = hero.replace(/^\.\//, '')
  return `/content/blog/${directory}/${cleaned}`.replace(/\/+/g, '/')
}

export function getBlogPosts(): BlogPost[] {
  return allBlogPosts
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
      hero: post.hero ? resolveHeroPath(post._meta.directory, post.hero) : null,
      heroDimensions: post.heroDimensions,
    }))
}
