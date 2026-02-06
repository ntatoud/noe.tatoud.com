import z from 'zod'

export const PARTICIPATION_TYPES = [
  'attended',
  'spoke',
  'organized',
  'volunteered',
  'animated',
] as const

export type ParticipationType = (typeof PARTICIPATION_TYPES)[number]

export const EVENT_KINDS = ['meetup', 'conference'] as const
export type EventKind = (typeof EVENT_KINDS)[number]

export const EVENT_SUBJECTS = [
  'tech',
  'agile',
  'science',
  'open-source',
] as const
export type EventSubject = (typeof EVENT_SUBJECTS)[number]

export const TechEventSchema = z.object({
  name: z.string(),
  city: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  date: z.string().date().or(z.date()),
  participationType: z.enum(PARTICIPATION_TYPES),
  kind: z.enum(EVENT_KINDS),
  subject: z.enum(EVENT_SUBJECTS),
  talkTitle: z.string().optional(),
  url: z.string().url().optional(),
})

export type TechEventFrontmatter = z.infer<typeof TechEventSchema>

export const PARTICIPATION_LABELS: Record<ParticipationType, string> = {
  attended: 'Attended',
  spoke: 'Spoke',
  organized: 'Organized',
  volunteered: 'Volunteered',
  animated: 'Animated',
}
