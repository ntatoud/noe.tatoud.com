import { allTalks } from 'content-collections'

import type { StageEvent, StageFrontmatter } from '../schemas/talks'

export type StageItem = Omit<StageFrontmatter, 'content'> & {
  slug: string
}

/** Returns the event with the most recent date, or undefined. */
function latestEvent(
  events: Array<StageEvent> | undefined,
): StageEvent | undefined {
  if (!events || events.length === 0) return undefined
  return events.reduce((latest, e) =>
    new Date(e.date) > new Date(latest.date) ? e : latest,
  )
}

export function getTalks(): StageItem[] {
  return allTalks
    .map((talk) => ({
      slug: talk._meta.path,
      title: talk.title,
      description: talk.description,
      kind: talk.kind,
      resource: talk.resource,
      tags: talk.tags,
      events: talk.events,
    }))
    .sort(
      (a, b) =>
        new Date(latestEvent(b.events)?.date ?? 0).getTime() -
        new Date(latestEvent(a.events)?.date ?? 0).getTime(),
    )
}
