import type { TalkDetail } from '@ntatoud/content'

import { ArrowLeft02Icon, ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Badge } from '@/components/ui/badge'
import { ButtonAnchor, ButtonLink } from '@/components/ui/button-link'
import { formatDate } from '@/lib/format'

type TalkPageProps = {
  talk: Omit<TalkDetail, 'Content'> & { bodyHtml: string }
}

export function TalkPage({ talk }: TalkPageProps) {
  return (
    <main
      className="mx-auto w-full min-w-0 max-w-3xl px-4 py-12"
      data-slot="talk-page"
    >
      <ButtonLink to="/talks" variant="ghost" size="sm">
        <HugeiconsIcon
          icon={ArrowLeft02Icon}
          size={16}
          data-icon="inline-start"
        />
        Talks
      </ButtonLink>
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
        <ButtonAnchor
          href={talk.resource.url}
          target="_blank"
          rel="noopener noreferrer"
          variant="ghost"
          size="sm"
          className="mt-4"
          data-slot="talk-resource"
        >
          {talk.resource.kind}
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            size={16}
            data-icon="inline-end"
          />
        </ButtonAnchor>
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
        className="typeset typeset-docs mt-8"
        data-slot="talk-content"
        dangerouslySetInnerHTML={{ __html: talk.bodyHtml }}
      />
    </main>
  )
}
