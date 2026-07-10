import * as v from 'valibot'

export const BlogPostSchema = v.object({
  title: v.string(),
  description: v.optional(v.string()),
  author: v.string(),
  date: v.string(),
  published: v.optional(v.boolean(), false),
  translations: v.optional(
    v.array(v.object({ lang: v.string(), url: v.pipe(v.string(), v.url()) })),
  ),
  tags: v.optional(v.array(v.string())),
  externalUrl: v.optional(v.pipe(v.string(), v.url())),
  hero: v.optional(v.string()),
  content: v.optional(v.string()),
})
