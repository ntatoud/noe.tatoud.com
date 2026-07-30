import { Collections } from '@ntatoud/effect-collections'
import type { CollectionData } from '@ntatoud/effect-collections'

import { Effect } from 'effect'

import { experiences as experiencesCollection } from '../collections.ts'

export type Experience = CollectionData<typeof experiencesCollection>

export const getExperiences = Collections.use((collections) =>
  collections.getAll(experiencesCollection),
).pipe(
  Effect.map((docs) =>
    docs
      .map((doc) => doc.data)
      .sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      ),
  ),
)
