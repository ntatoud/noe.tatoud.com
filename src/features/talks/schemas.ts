import * as v from 'valibot'

const TalkVenueSchema = v.object({
  event: v.string(),
  city: v.string(),
  date: v.string(),
  url: v.optional(v.pipe(v.string(), v.url())),
})

export const TalkSchema = v.object({
  title: v.string(),
  description: v.string(),
  slidesUrl: v.optional(v.pipe(v.string(), v.url())),
  tags: v.optional(v.array(v.string())),
  venues: v.optional(v.array(TalkVenueSchema), []),
  content: v.optional(v.string()),
})

export type TalkVenue = v.InferOutput<typeof TalkVenueSchema>
export type TalkFrontmatter = v.InferOutput<typeof TalkSchema>
