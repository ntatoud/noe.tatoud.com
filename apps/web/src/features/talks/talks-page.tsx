import type { StageItem } from '@ntatoud/content'

import { TalkCard } from '@/features/talks/talk-card'

type TalksPageProps = {
  talks: readonly StageItem[]
}

export function TalksPage({ talks }: TalksPageProps) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12" data-slot="talks-page">
      <h1 className="text-3xl font-bold tracking-tight">Talks</h1>
      <p className="mt-2 text-muted-foreground">
        Conference talks and stage sessions.
      </p>
      <ul
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        data-slot="talks-page-list"
      >
        {talks.map((talk) => (
          <TalkCard key={talk.slug} talk={talk} />
        ))}
      </ul>
    </main>
  )
}
