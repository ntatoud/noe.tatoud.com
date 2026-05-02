import { createServerFn } from '@tanstack/react-start'

import { allTalks } from 'content-collections'

import type { TalkFrontmatter } from '@/features/talks/schemas'

export type Talk = Omit<TalkFrontmatter, 'content'> & {
  slug: string
}

export const getTalks = createServerFn({ method: 'GET' }).handler(() =>
  allTalks
    .map((talk) => ({
      slug: talk._meta.path,
      title: talk.title,
      description: talk.description,
      slidesUrl: talk.slidesUrl,
      tags: talk.tags,
      venues: talk.venues,
    }))
    .sort(
      (a, b) =>
        new Date(b.venues?.[0]?.date ?? 0).getTime() -
        new Date(a.venues?.[0]?.date ?? 0).getTime(),
    ),
)
