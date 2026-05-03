import { createServerFn } from '@tanstack/react-start'

import { allTalks } from 'content-collections'

import type { StageFrontmatter } from '@/features/talks/schemas'
import { latestEvent } from '@/lib/stage'

export type StageItem = Omit<StageFrontmatter, 'content'> & {
  slug: string
}

export const getTalks = createServerFn({ method: 'GET' }).handler(() =>
  allTalks
    .map((talk) => ({
      slug: talk._meta.path,
      title: talk.title,
      description: talk.description,
      kind: talk.kind,
      resource: talk.resource,
      tags: talk.tags,
      events: talk.events,
    }))
    .sort(
      (a, b) =>
        new Date(latestEvent(b.events)?.date ?? 0).getTime() -
        new Date(latestEvent(a.events)?.date ?? 0).getTime(),
    ),
)
