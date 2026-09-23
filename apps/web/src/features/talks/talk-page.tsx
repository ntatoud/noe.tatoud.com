import type { TalkDetail } from '@ntatoud/content'

import { DetailPage, ExternalLinkButton } from '@/components/detail-page'
import { formatDate } from '@/lib/format'

type TalkPageProps = {
  talk: TalkDetail
}

export function TalkPage({ talk }: TalkPageProps) {
  return (
    <DetailPage
      slot="talk"
      back={{ to: '/talks', label: 'Talks' }}
      title={talk.title}
      badge={talk.kind}
      description={talk.description}
      tags={talk.tags}
      html={talk.html}
    >
      {talk.resource && (
        <ExternalLinkButton
          href={talk.resource.url}
          className="mt-4"
          data-slot="talk-resource"
        >
          {talk.resource.kind}
        </ExternalLinkButton>
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
    </DetailPage>
  )
}
