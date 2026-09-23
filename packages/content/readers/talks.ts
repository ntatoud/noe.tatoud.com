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

export const getTalks = Collections.use((collections) =>
  collections.getAll(talksCollection),
).pipe(
  Effect.map((docs) =>
    docs
      .map((doc) => doc.data)
      .sort(
        (a, b) =>
          new Date(b.events[0]?.date ?? 0).getTime() -
          new Date(a.events[0]?.date ?? 0).getTime(),
      ),
  ),
)
