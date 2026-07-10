import { allExperiences } from 'content-collections'

import type { ExperienceFrontmatter } from '../schemas/experiences'

export type Experience = Omit<ExperienceFrontmatter, 'content' | 'logo'> & {
  slug: string
  logo: string | null
}

export function getExperiences(): Experience[] {
  return allExperiences
    .map((exp) => ({
      slug: exp._meta.path,
      title: exp.title,
      organization: exp.organization,
      url: exp.url,
      startDate: exp.startDate,
      endDate: exp.endDate,
      kind: exp.kind,
      logo: exp.logo ?? null,
    }))
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    )
}
