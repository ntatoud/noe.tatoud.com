import type { ComponentType } from 'react'

import { Collections } from '@ntatoud/effect-collections'

import { Effect } from 'effect'

import { talks as talksCollection } from '../collections'
import type { StageEvent, StageFrontmatter } from '../schemas/talks'

export type StageItem = StageFrontmatter & {
  slug: string
}

export type TalkDetail = StageItem & {
  Content: ComponentType
}

/** Returns the event with the most recent date, or undefined. */
function latestEvent(
  events: ReadonlyArray<StageEvent> | undefined,
): StageEvent | undefined {
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
      .map((doc) => ({ slug: doc.slug, ...doc.data }))
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
  ).pipe(
    Effect.map(
      (doc): TalkDetail => ({
        slug: doc.slug,
        ...doc.data,
        Content: doc.Content,
      }),
    ),
  )
