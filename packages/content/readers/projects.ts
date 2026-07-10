import { allProjects } from 'content-collections'

import type { ProjectFrontmatter } from '../schemas/projects'

export type Project = Omit<ProjectFrontmatter, 'content'> & {
  slug: string
}

export function getProjects(): Project[] {
  return allProjects
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
    })
}
