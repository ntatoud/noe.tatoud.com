import { defineCollection, type ResolveImageRefs } from 'effect-collections'

import { BlogFrontmatter } from '#blog/schema'

const BLOG = 'blog'

export type BlogPost = ResolveImageRefs<BlogFrontmatter> & {
  readonly slug: string
  readonly url: string
}

export type BlogPostWithBody = BlogPost & { readonly body: string }

export const blog = defineCollection({
  name: BLOG,
  schema: BlogFrontmatter,
  include: (post) => post.published,
  order: (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
})
