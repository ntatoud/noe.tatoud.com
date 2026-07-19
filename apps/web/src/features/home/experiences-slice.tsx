import type { Experience } from '@ntatoud/content'

import { ContentList } from '@/components/content-list'

import { Slice } from './slice'

type ExperiencesSliceProps = {
  experiences: Experience[]
}

export function ExperiencesSlice({ experiences }: ExperiencesSliceProps) {
  const latest = experiences.slice(0, 2)

  return (
    <Slice title="Experiences" data-slot="experiences-slice">
      <ContentList
        items={latest.map((exp) => ({
          key: exp.slug,
          href: exp.url,
          title: `${exp.title} · ${exp.organization}`,
          external: true,
        }))}
      />
    </Slice>
  )
}
