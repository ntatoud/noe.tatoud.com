import type { ComponentType } from 'react'

import { Collections } from '@ntatoud/effect-collections'

import { Effect } from 'effect'

import { projects as projectsCollection } from '../collections'
import type { ProjectFrontmatter } from '../schemas/projects'

export type Project = ProjectFrontmatter & {
  slug: string
}

export type ProjectDetail = Project & {
  Content: ComponentType
}

export const getProjects = Collections.use((collections) =>
  collections.getAll(projectsCollection),
).pipe(
  Effect.map((docs) =>
    docs
      .map((doc) => ({ slug: doc.slug, ...doc.data }))
      .filter((project) => project.published)
      .sort((a, b) => {
        if (a.kind !== b.kind) return a.kind === 'personal' ? -1 : 1
        return 0
      }),
  ),
)

export const getProject = (slug: string) =>
  Collections.use((collections) =>
    collections.getBySlug(projectsCollection, slug),
  ).pipe(
    Effect.map(
      (doc): ProjectDetail => ({
        slug: doc.slug,
        ...doc.data,
        Content: doc.Content,
      }),
    ),
  )
