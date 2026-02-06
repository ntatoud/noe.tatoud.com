import { createServerFn } from '@tanstack/react-start'
import type { ProjectFrontmatter } from './schemas'
import { projects } from '@/lib/source'

export type Project = ProjectFrontmatter & { slug: string }

export const getProjects = createServerFn({ method: 'GET' }).handler(() =>
  projects
    .getPages()
    .filter((page) => page.data.published)
    .map((page) => ({
      slug: page.slugs.join('/'),
      title: page.data.title,
      description: page.data.description,
      date: page.data.date,
      published: page.data.published,
      kind: page.data.kind,
      url: page.data.url,
      repo: page.data.repo,
      tags: page.data.tags,
    }))
    .sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === 'personal' ? -1 : 1
      return 0
    }),
)
