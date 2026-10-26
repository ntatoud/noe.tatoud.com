import type { CollectionData, DocumentMeta } from '@ntatoud/effect-collections'

import { experiences as experiencesCollection } from '../collections.ts'
import { newestFirst } from '../sort.ts'

export type Experience = CollectionData<typeof experiencesCollection>

/** Every experience, most recently started first. */
export const getExperiences = (
  documents: ReadonlyArray<DocumentMeta<Experience>>,
): ReadonlyArray<Experience> =>
  documents
    .map((doc) => doc.data)
    .sort(newestFirst((experience) => experience.startDate))
