import type { CollectionData, DocumentMeta } from '@ntatoud/effect-collections'

import { talks as talksCollection } from '../collections.ts'
import { newestFirst } from '../sort.ts'

export type StageItem = CollectionData<typeof talksCollection>

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
    .sort(newestFirst((talk) => talk.events[0]?.date))
