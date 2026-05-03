import type { StageEvent } from '@/features/talks/schemas'

/** Returns the event with the most recent date, or undefined. */
export function latestEvent(
  events: Array<StageEvent> | undefined,
): StageEvent | undefined {
  if (!events || events.length === 0) return undefined
  return events.reduce((latest, e) =>
    new Date(e.date) > new Date(latest.date) ? e : latest,
  )
}

/** Returns events sorted by date descending (most recent first). */
export function sortEventsByDate(events: Array<StageEvent>): Array<StageEvent> {
  return [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}
