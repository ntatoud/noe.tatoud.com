import type { TalkDetail } from '@ntatoud/content'

import { DetailPage } from '@/components/detail-page'
import { SayHello } from '@/components/say-hello'
import { formatDate } from '@/lib/format'

import { TalkKindChip } from './talk-card'
import { TalkResourcePreview } from './talk-resource-preview'

type TalkPageProps = {
  talk: TalkDetail
}

export function TalkPage({ talk }: TalkPageProps) {
  return (
    <DetailPage
      slot="talk"
      back={{ to: '/talks', label: 'Talks' }}
      title={talk.title}
      badge={<TalkKindChip kind={talk.kind} />}
      description={talk.description}
      tags={talk.tags}
      html={talk.html}
      footer={
        <SayHello
          title="Want this at your event?"
          subject={`${talk.kind === 'workshop' ? 'Workshop' : 'Talk'}: ${talk.title}`}
          className="mt-16"
        >
          <p>
            If you think this {talk.kind} would suit your meetup or conference,
            tell me about your audience and we can see if it fits.
          </p>
        </SayHello>
      }
    >
      {talk.events.length > 0 && (
        <ul className="mt-6 flex flex-col gap-2" data-slot="talk-events">
          {talk.events.map((event) => (
            <li
              key={`${event.event}-${event.date}`}
              className="text-sm text-muted-foreground"
            >
              {event.event.includes(event.city.split(',')[0] ?? '')
                ? event.event
                : `${event.event}, ${event.city}`}{' '}
              · <time dateTime={event.date}>{formatDate(event.date)}</time>
            </li>
          ))}
        </ul>
      )}

      {talk.resource && <TalkResourcePreview {...talk.resource} />}
    </DetailPage>
  )
}
