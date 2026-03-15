import z from 'zod'

const TranslationSchema = z.object({
  lang: z.string(),
  url: z.string().url(),
})

export const BlogPostSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  author: z.string(),
  date: z.string().date().or(z.date()),
  published: z.boolean().default(false),
  translations: z.array(TranslationSchema).optional(),
  tags: z.array(z.string()).optional(),
  externalUrl: z.string().url().optional(),
})

export type BlogPostFrontmatter = z.infer<typeof BlogPostSchema>
