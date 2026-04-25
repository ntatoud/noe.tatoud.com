import z from 'zod'

export type ExperienceFrontmatter = z.infer<typeof ExperienceSchema>

export const ExperienceSchema = z.object({
  title: z.string(),
  organization: z.string(),
  url: z.string().url().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  kind: z.enum(['work', 'volunteer', 'education']),
  logo: z.string().optional(),
  content: z.string().optional(),
})
