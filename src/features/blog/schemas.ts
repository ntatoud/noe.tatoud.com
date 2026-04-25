import z from 'zod'

export const BlogPostSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  author: z.string(),
  date: z.string(),
  published: z.boolean().default(false),
  translations: z
    .array(z.object({ lang: z.string(), url: z.string().url() }))
    .optional(),
  tags: z.array(z.string()).optional(),
  externalUrl: z.string().url().optional(),
  hero: z.string().optional(),
  content: z.string().optional(),
})
