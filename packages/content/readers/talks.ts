import type { CollectionData, DocumentMeta } from '@ntatoud/effect-collections'

import { talks as talksCollection } from '../collections.ts'

export type StageItem = CollectionData<typeof talksCollection>

export type TalkEvent = StageItem['events'][number]

export type TalkDetail = StageItem & {
  /** The rendered body, as HTML. */
  html: string
}

/** Every talk, ordered by its most recent event (`events[0]`), newest first. */
export const getTalks = (
  documents: ReadonlyArray<DocumentMeta<StageItem>>,
): ReadonlyArray<StageItem> =>
  documents
    .map((doc) => doc.data)
    .sort(
      (a, b) =>
        new Date(b.events[0]?.date ?? 0).getTime() -
        new Date(a.events[0]?.date ?? 0).getTime(),
    )
