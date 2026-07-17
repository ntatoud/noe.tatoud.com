import type { ComponentType } from 'react'

import { getAll, getBySlug } from '@ntatoud/effect-collections'

import { projects as projectsCollection } from '../collections'
import type { ProjectFrontmatter } from '../schemas/projects'

export type Project = ProjectFrontmatter & {
  slug: string
}

export type ProjectDetail = Project & {
  Content: ComponentType
}

export async function getProjects(): Promise<Project[]> {
  const docs = await getAll(projectsCollection)
  return docs
    .map((doc) => ({ slug: doc.slug, ...doc.data }))
    .filter((project) => project.published)
    .sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === 'personal' ? -1 : 1
      return 0
    })
}

export async function getProject(slug: string): Promise<ProjectDetail> {
  const doc = await getBySlug(projectsCollection, slug)
  return { slug: doc.slug, ...doc.data, Content: doc.Content }
}
