import * as v from 'valibot'

export type ExperienceFrontmatter = v.InferOutput<typeof ExperienceSchema>

export const ExperienceSchema = v.object({
  title: v.string(),
  organization: v.string(),
  url: v.optional(v.pipe(v.string(), v.url())),
  startDate: v.string(),
  endDate: v.optional(v.string()),
  kind: v.picklist(['work', 'volunteer', 'education']),
  logo: v.optional(v.string()),
  content: v.optional(v.string()),
})
