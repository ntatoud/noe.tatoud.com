import type { StageItem } from '@ntatoud/content'

import { ContentList } from '@/components/content-list'

type TalksPageProps = {
  talks: StageItem[]
}

export function TalksPage({ talks }: TalksPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12" data-slot="talks-page">
      <h1 className="text-3xl font-bold tracking-tight">Talks</h1>
      <p className="mt-2 text-muted-foreground">
        Conference talks and stage sessions.
      </p>
      <ContentList
        className="mt-8"
        items={talks.map((talk) => ({
          key: talk.slug,
          href: `/talks/${talk.slug}`,
          title: talk.title,
        }))}
      />
    </main>
  )
}
