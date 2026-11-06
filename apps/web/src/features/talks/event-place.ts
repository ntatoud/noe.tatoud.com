import type { StageItem } from '@ntatoud/content'

type StageEvent = StageItem['events'][number]

export function eventPlace({ event, city }: StageEvent): string {
  const town = city.split(',')[0] ?? city
  return event.includes(town) ? event : `${event}, ${city}`
}
