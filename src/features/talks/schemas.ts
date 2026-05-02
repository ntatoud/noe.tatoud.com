import * as v from 'valibot'

const TalkEventSchema = v.object({
  event: v.string(),
  city: v.string(),
  date: v.string(),
  url: v.optional(v.pipe(v.string(), v.url())),
  logo: v.optional(v.string()),
})

export const TalkSchema = v.object({
  title: v.string(),
  description: v.string(),
  slidesUrl: v.optional(v.pipe(v.string(), v.url())),
  tags: v.optional(v.array(v.string())),
  events: v.optional(v.array(TalkEventSchema), []),
  content: v.optional(v.string()),
})

export type TalkEvent = v.InferOutput<typeof TalkEventSchema>
export type TalkFrontmatter = v.InferOutput<typeof TalkSchema>
