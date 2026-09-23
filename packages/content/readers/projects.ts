import { Collections } from '@ntatoud/effect-collections'
import type { CollectionData } from '@ntatoud/effect-collections'

import { Effect } from 'effect'

import { projects as projectsCollection } from '../collections.ts'

export type Project = CollectionData<typeof projectsCollection>

export type ProjectDetail = Project & {
  /** The rendered body, as HTML. */
  html: string
}

export const getProjects = Collections.use((collections) =>
  collections.getAll(projectsCollection),
).pipe(
  Effect.map((docs) =>
    docs
      .map((doc) => doc.data)
      .filter((project) => project.published)
      .sort((a, b) => {
        if (a.kind !== b.kind) return a.kind === 'personal' ? -1 : 1
        return 0
      }),
  ),
)
