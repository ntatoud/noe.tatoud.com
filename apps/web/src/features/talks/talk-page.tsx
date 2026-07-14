import { Link } from '@tanstack/react-router'

import { MdxRenderer } from '@/components/mdx/mdx-renderer'
import { Badge } from '@/components/ui/badge'
import { ButtonAnchor } from '@/components/ui/button-link'
import type { TalkResource, TalkWithBody } from '@/lib/content'
import { formatDate } from '@/lib/format'

type TalkPageProps = {
  talk: TalkWithBody
}

const resourceLabel: Record<TalkResource['kind'], string> = {
  slides: 'Slides',
  docs: 'Docs',
  website: 'Website',
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
      <div className="mt-6 flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight">{talk.title}</h1>
        <Badge>{talk.kind}</Badge>
      </div>
      <p className="mt-2 text-muted-foreground">{talk.description}</p>
      {talk.resource && (
        <div className="mt-4">
          <ButtonAnchor
            href={talk.resource.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {resourceLabel[talk.resource.kind]}
          </ButtonAnchor>
        </div>
      )}
      {talk.tags && talk.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {talk.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      {talk.events.length > 0 && (
        <ul className="mt-8 flex flex-col gap-2" data-slot="talk-events">
          {talk.events.map((event) => (
            <li
              key={`${event.event}-${event.date}`}
              className="text-sm text-muted-foreground"
            >
              {event.url ? (
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  {event.event}
                </a>
              ) : (
                <span className="text-foreground">{event.event}</span>
              )}{' '}
              — {event.city} · {formatDate(event.date)}
            </li>
          ))}
        </ul>
      )}
      <div className="prose prose-invert mt-8 max-w-none" data-slot="talk-body">
        <MdxRenderer body={talk.body} />
      </div>
    </main>
  )
}
