import * as v from 'valibot'

const StageEventSchema = v.object({
  event: v.string(),
  city: v.string(),
  date: v.string(),
  url: v.optional(v.pipe(v.string(), v.url())),
  logo: v.optional(v.string()),
})

const StageResourceSchema = v.object({
  kind: v.picklist(['slides', 'docs', 'website']),
  url: v.pipe(v.string(), v.url()),
})

export const StageItemSchema = v.object({
  title: v.string(),
  description: v.string(),
  kind: v.optional(v.picklist(['talk', 'workshop']), 'talk'),
  resource: v.optional(StageResourceSchema),
  tags: v.optional(v.array(v.string())),
  events: v.optional(v.array(StageEventSchema), []),
  content: v.optional(v.string()),
})

export type StageEvent = v.InferOutput<typeof StageEventSchema>
export type StageResource = v.InferOutput<typeof StageResourceSchema>
export type StageFrontmatter = v.InferOutput<typeof StageItemSchema>
