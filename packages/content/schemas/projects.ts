import * as v from 'valibot'

export type ProjectFrontmatter = v.InferOutput<typeof ProjectSchema>

export const ProjectSchema = v.object({
  title: v.string(),
  description: v.optional(v.string()),
  date: v.string(),
  published: v.optional(v.boolean(), false),
  kind: v.optional(v.picklist(['personal', 'contribution']), 'personal'),
  url: v.optional(v.pipe(v.string(), v.url())),
  repo: v.optional(v.pipe(v.string(), v.url())),
  tags: v.optional(v.array(v.string())),
  content: v.optional(v.string()),
})
