import * as path from 'node:path'

import { defineCollection } from '@ntatoud/effect-collections'
import type { CollectionData } from '@ntatoud/effect-collections'

import { contentRoot } from '../content-url.ts'
import { ProjectSchema } from '../schemas/projects.ts'
import { defineContentCollection } from './define.ts'
import { metaList } from './twin-lines.ts'

const collection = defineCollection({
  name: 'projects',
  directory: path.join(contentRoot, 'projects'),
  schema: ProjectSchema,
  transform: (data, meta) => ({
    ...data,
    slug: meta.slug,
    path: `/projects/${meta.slug}`,
  }),
})

export type Project = CollectionData<typeof collection>

export type ProjectDetail = Project & {
  /** The rendered body, as HTML. */
  html: string
}

export const projects = defineContentCollection({
  key: 'projects',
  collection,
  // Published projects, personal ones before contributions.
  reader: (documents) =>
    documents
      .map((doc) => doc.data)
      .filter((project) => project.published)
      .sort((a, b) => {
        if (a.kind !== b.kind) return a.kind === 'personal' ? -1 : 1
        return 0
      }),
  index: {
    title: 'Projects',
    entry: (project) => ({
      title: project.title,
      routePath: project.path,
      description: project.description,
      note: project.kind,
    }),
  },
  listingPage: { name: 'projects', path: '/projects' },
  detail: {
    loader: 'loadProject',
    kind: 'project',
    page: (project) => ({
      path: project.path,
      title: project.title,
      description: project.description,
      details: [
        `- Date: ${project.date}`,
        `- Kind: ${project.kind}`,
        project.url ? `- Website: ${project.url}` : null,
        project.repo ? `- Repository: ${project.repo}` : null,
        metaList('Tags', project.tags),
      ],
    }),
  },
})
