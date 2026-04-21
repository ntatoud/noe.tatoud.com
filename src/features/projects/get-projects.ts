import { createServerFn } from '@tanstack/react-start'

import { allProjects } from 'content-collections'

import type { ProjectFrontmatter } from '@/features/projects/schemas'

export type Project = Omit<ProjectFrontmatter, 'content'> & {
  slug: string
}

export const getProjects = createServerFn({ method: 'GET' }).handler(() =>
  allProjects
    .filter((project) => project.published)
    .map((project) => ({
      slug: project._meta.path,
      title: project.title,
      description: project.description,
      date: project.date,
      published: project.published,
      kind: project.kind,
      url: project.url,
      repo: project.repo,
      tags: project.tags,
    }))
    .sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === 'personal' ? -1 : 1
      return 0
    }),
)
