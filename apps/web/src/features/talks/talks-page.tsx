import { Link } from '@tanstack/react-router'

import type { StageItem } from '@/lib/content'

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
      <ul className="mt-8 flex flex-col gap-2">
        {talks.map((talk) => (
          <li key={talk.slug}>
            <Link
              to="/talks/$slug"
              params={{ slug: talk.slug }}
              className="text-sm text-foreground underline-offset-4 hover:underline"
            >
              {talk.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
