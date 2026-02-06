import z from 'zod'

export const ProjectSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.string().date().or(z.date()),
  published: z.boolean().default(false),
  kind: z.enum(['personal', 'contribution']).default('personal'),
  url: z.string().url().optional(),
  repo: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
})

export type ProjectFrontmatter = z.infer<typeof ProjectSchema>
