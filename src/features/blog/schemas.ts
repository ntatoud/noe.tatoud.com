import z from 'zod'

export const BlogPostSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  author: z.string(),
  date: z.string().date().or(z.date()),
})
