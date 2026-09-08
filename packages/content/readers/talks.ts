import { Collections } from '@ntatoud/effect-collections'
import type { CollectionData } from '@ntatoud/effect-collections'

import { Effect } from 'effect'

import { talks as talksCollection } from '../collections.ts'

export type StageItem = CollectionData<typeof talksCollection>

export type TalkEvent = StageItem['events'][number]

export type TalkDetail = StageItem & {
  /** The rendered body, as HTML. */
  html: string
}

/** Returns the event with the most recent date, or undefined. */
function latestEvent(
  events: ReadonlyArray<TalkEvent> | undefined,
): TalkEvent | undefined {
  if (!events || events.length === 0) return undefined
  return events.reduce((latest, e) =>
    new Date(e.date) > new Date(latest.date) ? e : latest,
  )
}

export const getTalks = Collections.use((collections) =>
  collections.getAll(talksCollection),
).pipe(
  Effect.map((docs) =>
    docs
      .map((doc) => doc.data)
      .sort(
        (a, b) =>
          new Date(latestEvent(b.events)?.date ?? 0).getTime() -
          new Date(latestEvent(a.events)?.date ?? 0).getTime(),
      ),
  ),
)

export const getTalk = (slug: string) =>
  Collections.use((collections) =>
    collections.getBySlug(talksCollection, slug),
  ).pipe(Effect.map((doc): TalkDetail => ({ ...doc.data, html: doc.html })))
