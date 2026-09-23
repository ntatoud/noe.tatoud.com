import type { CollectionData, DocumentMeta } from '@ntatoud/effect-collections'

import { projects as projectsCollection } from '../collections.ts'

export type Project = CollectionData<typeof projectsCollection>

export type ProjectDetail = Project & {
  /** The rendered body, as HTML. */
  html: string
}

/** Published projects, personal ones before contributions. */
export const getProjects = (
  documents: ReadonlyArray<DocumentMeta<Project>>,
): ReadonlyArray<Project> =>
  documents
    .map((doc) => doc.data)
    .filter((project) => project.published)
    .sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === 'personal' ? -1 : 1
      return 0
    })
