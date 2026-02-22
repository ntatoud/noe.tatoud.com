import z from 'zod'

export const ExperienceSchema = z.object({
  title: z.string(),
  organization: z.string(),
  url: z.string().url().optional(),
  startDate: z.string().date().or(z.date()),
  endDate: z.string().date().or(z.date()).optional(),
  kind: z.enum(['work', 'volunteer', 'education']),
})

export type ExperienceFrontmatter = z.infer<typeof ExperienceSchema>
