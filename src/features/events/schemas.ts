import z from 'zod'

export const PARTICIPATION_TYPES = [
  'attended',
  'spoke',
  'organized',
  'volunteered',
  'mentored',
] as const

export type ParticipationType = (typeof PARTICIPATION_TYPES)[number]

export const TechEventSchema = z.object({
  name: z.string(),
  city: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  date: z.string().date().or(z.date()),
  participationType: z.enum(PARTICIPATION_TYPES),
  talkTitle: z.string().optional(),
  url: z.string().url().optional(),
})

export type TechEventFrontmatter = z.infer<typeof TechEventSchema>
