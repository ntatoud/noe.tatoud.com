import type { Experience } from '@ntatoud/content'

import { ContentList } from '@/components/content-list'

import { Slice } from './slice'

type ExperiencesSliceProps = {
  experiences: readonly Experience[]
}

export function ExperiencesSlice({ experiences }: ExperiencesSliceProps) {
  return (
    <Slice title="Experiences" data-slot="experiences-slice">
      <ContentList
        items={experiences.map((exp) => ({
          key: exp.slug,
          href: exp.url,
          title: `${exp.title} · ${exp.organization}`,
          external: true,
          // Already a hashed asset URL — the build-time content plugin turns the
          // frontmatter path into a real Vite import.
          image: exp.logo
            ? { src: exp.logo, alt: `${exp.organization} logo` }
            : undefined,
        }))}
      />
    </Slice>
  )
}
