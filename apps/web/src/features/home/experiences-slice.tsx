import type { Experience } from '@ntatoud/content'

import { ContentList } from '@/components/content-list'
import { resolveContentImage } from '@/lib/content-images'

import { Slice } from './slice'

type ExperiencesSliceProps = {
  experiences: Experience[]
}

export function ExperiencesSlice({ experiences }: ExperiencesSliceProps) {
  return (
    <Slice title="Experiences" data-slot="experiences-slice">
      <ContentList
        items={experiences.map((exp) => {
          const logoSrc = resolveContentImage(exp.logo)
          return {
            key: exp.slug,
            href: exp.url,
            title: `${exp.title} · ${exp.organization}`,
            external: true,
            image: logoSrc
              ? { src: logoSrc, alt: `${exp.organization} logo` }
              : undefined,
          }
        })}
      />
    </Slice>
  )
}
