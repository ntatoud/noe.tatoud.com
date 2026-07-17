import type { TalkDetail } from '@ntatoud/content'
import { Link } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/format'

type TalkPageProps = {
  talk: Omit<TalkDetail, 'Content'> & { bodyHtml: string }
}

export function TalkPage({ talk }: TalkPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12" data-slot="talk-page">
      <Link
        to="/talks"
        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        ← Talks
      </Link>
      <div className="mt-6 flex items-center gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{talk.title}</h1>
        <Badge>{talk.kind}</Badge>
      </div>
      <p className="mt-2 text-muted-foreground">{talk.description}</p>

      {talk.tags && talk.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {talk.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {talk.resource && (
        <a
          href={talk.resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm text-foreground underline-offset-4 hover:underline"
          data-slot="talk-resource"
        >
          {talk.resource.kind} →
        </a>
      )}

      {talk.events.length > 0 && (
        <ul className="mt-6 flex flex-col gap-2" data-slot="talk-events">
          {talk.events.map((event) => (
            <li
              key={`${event.event}-${event.date}`}
              className="text-sm text-muted-foreground"
            >
              {event.event} — {event.city} · {formatDate(event.date)}
            </li>
          ))}
        </ul>
      )}

      <div
        className="prose prose-invert mt-8"
        data-slot="talk-content"
        dangerouslySetInnerHTML={{ __html: talk.bodyHtml }}
      />
    </main>
  )
}
