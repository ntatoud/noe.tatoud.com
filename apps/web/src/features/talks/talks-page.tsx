import type { StageItem } from '@ntatoud/content'

import { ListingPage } from '@/components/listing-page'
import { TalkCard } from '@/features/talks/talk-card'

type TalksPageProps = {
  talks: readonly StageItem[]
}

export function TalksPage({ talks }: TalksPageProps) {
  return (
    <ListingPage
      slot="talks-page"
      title="Talks"
      subtitle="Conference talks and stage sessions."
      columns={3}
    >
      {talks.map((talk) => (
        <TalkCard key={talk.slug} talk={talk} />
      ))}
    </ListingPage>
  )
}
