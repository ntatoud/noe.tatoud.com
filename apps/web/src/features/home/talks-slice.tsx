import type { StageItem } from '@ntatoud/content'

import { TalkCard } from '@/features/talks/talk-card'

import { Slice } from './slice'

type TalksSliceProps = {
  talks: readonly StageItem[]
}

export function TalksSlice({ talks }: TalksSliceProps) {
  const recent = talks.slice(0, 2)

  return (
    <Slice title="Talks" seeAllHref="/talks" data-slot="talks-slice">
      <ul
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        data-slot="talks-slice-list"
      >
        {recent.map((talk) => (
          <TalkCard key={talk.slug} talk={talk} />
        ))}
      </ul>
    </Slice>
  )
}
