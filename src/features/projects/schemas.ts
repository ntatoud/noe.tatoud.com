import z from 'zod'

export type ProjectFrontmatter = z.infer<typeof ProjectSchema>

export const ProjectSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.string(),
  published: z.boolean().default(false),
  kind: z.enum(['personal', 'contribution']).default('personal'),
  url: z.string().url().optional(),
  repo: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  content: z.string().optional(),
})
