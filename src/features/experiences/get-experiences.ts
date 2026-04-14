import { createServerFn } from '@tanstack/react-start'

import { experiences } from '@/lib/source'

import type { ExperienceFrontmatter } from './schemas'

export type Experience = ExperienceFrontmatter & {
  slug: string
  logo: string | null
}

export const getExperiences = createServerFn({ method: 'GET' }).handler(() =>
  experiences
    .getPages()
    .map((page) => ({
      slug: page.slugs.join('/'),
      title: page.data.title,
      organization: page.data.organization,
      url: page.data.url,
      startDate: page.data.startDate,
      endDate: page.data.endDate,
      kind: page.data.kind,
      logo: (page.data._exports.logo as string | undefined) ?? null,
    }))
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    ),
)
