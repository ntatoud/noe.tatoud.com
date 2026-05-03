import * as v from 'valibot'

const TalkEventSchema = v.object({
  event: v.string(),
  city: v.string(),
  date: v.string(),
  url: v.optional(v.pipe(v.string(), v.url())),
  logo: v.optional(v.string()),
})

const TalkResourceSchema = v.object({
  kind: v.picklist(['slides', 'docs', 'website']),
  url: v.pipe(v.string(), v.url()),
})

export const TalkSchema = v.object({
  title: v.string(),
  description: v.string(),
  kind: v.optional(v.picklist(['talk', 'workshop']), 'talk'),
  resource: v.optional(TalkResourceSchema),
  tags: v.optional(v.array(v.string())),
  events: v.optional(v.array(TalkEventSchema), []),
  content: v.optional(v.string()),
})

export type TalkEvent = v.InferOutput<typeof TalkEventSchema>
export type TalkResource = v.InferOutput<typeof TalkResourceSchema>
export type TalkFrontmatter = v.InferOutput<typeof TalkSchema>
