import { createServerFn } from '@tanstack/react-start'
import type { TechEventFrontmatter } from './schemas'
import { events } from '@/lib/source'

export type TechEvent = TechEventFrontmatter & { slug: string }

export const getEvents = createServerFn({ method: 'GET' }).handler(() =>
  events.getPages().map((page) => ({
    slug: page.slugs.join('/'),
    name: page.data.name,
    city: page.data.city,
    latitude: page.data.latitude,
    longitude: page.data.longitude,
    date: page.data.date,
    participationType: page.data.participationType,
    talkTitle: page.data.talkTitle,
    url: page.data.url,
  })),
)
