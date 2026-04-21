import { createServerFn } from '@tanstack/react-start'

import { allExperiences } from 'content-collections'

import type { ExperienceFrontmatter } from '@/features/experiences/schemas'
import { resolveContentImage } from '@/lib/content-images'

export type Experience = Omit<ExperienceFrontmatter, 'content' | 'logo'> & {
  slug: string
  logo: string | null
}

export const getExperiences = createServerFn({ method: 'GET' }).handler(() =>
  allExperiences
    .map((exp) => ({
      slug: exp._meta.path,
      title: exp.title,
      organization: exp.organization,
      url: exp.url,
      startDate: exp.startDate,
      endDate: exp.endDate,
      kind: exp.kind,
      logo: resolveContentImage(
        `content/experiences/${exp._meta.directory}`,
        exp.logo,
      ),
    }))
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    ),
)
