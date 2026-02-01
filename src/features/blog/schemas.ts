import z from 'zod'

export const BlogPostSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  author: z.string(),
  date: z.string().date().or(z.date()),
})

export type BlogPostFrontmatter = z.infer<typeof BlogPostSchema>

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
