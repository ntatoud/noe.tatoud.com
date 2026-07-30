import type { StageItem } from '@ntatoud/content'

import { ContentList } from '@/components/content-list'

import { Slice } from './slice'

type TalksSliceProps = {
  talks: readonly StageItem[]
}

export function TalksSlice({ talks }: TalksSliceProps) {
  const recent = talks.slice(0, 2)

  return (
    <Slice title="Talks" seeAllHref="/talks" data-slot="talks-slice">
      <ContentList
        items={recent.map((talk) => ({
          key: talk.slug,
          href: `/talks/${talk.slug}`,
          title: talk.title,
        }))}
      />
    </Slice>
  )
}
