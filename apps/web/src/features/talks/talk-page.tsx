import type { BlogPost, StageItem, TalkDetail } from '@ntatoud/content'

import { DetailPage } from '@/components/detail-page'
import { MoreSection } from '@/components/more-section'
import { SayHello } from '@/components/say-hello'
import { BlogCard } from '@/features/blog/blog-card'
import { formatDate } from '@/lib/format'

import { eventPlace } from './event-place'
import { TalkCard, TalkKindChip } from './talk-card'
import { TalkResourcePreview } from './talk-resource-preview'

type TalkPageProps = {
  talk: TalkDetail
  moreTalks: readonly StageItem[]
  relatedWriting: readonly BlogPost[]
}

export function TalkPage({ talk, moreTalks, relatedWriting }: TalkPageProps) {
  const forKids = talk.tags?.includes('kids') ?? false
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
        <>
          <SayHello
            title="Want this at your event?"
            subject={`${talk.kind === 'workshop' ? 'Workshop' : 'Talk'}: ${talk.title}`}
            className="mt-16"
          >
            <p>
              {forKids
                ? `If this ${talk.kind} would suit your school, club or event, tell me about the kids and we can see if it fits.`
                : `If this ${talk.kind} would suit your meetup or conference, tell me about your audience and we can see if it fits.`}
            </p>
          </SayHello>
          {relatedWriting.length > 0 && (
            <MoreSection title="Related writing" slot="related-writing">
              {relatedWriting.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </MoreSection>
          )}
          {moreTalks.length > 0 && (
            <MoreSection title="More talks and workshops" slot="more-talks">
              {moreTalks.map((other) => (
                <TalkCard key={other.slug} talk={other} />
              ))}
            </MoreSection>
          )}
        </>
      }
    >
      {talk.events.length > 0 && (
        <ul className="mt-6 flex flex-col gap-2" data-slot="talk-events">
          {talk.events.map((event) => (
            <li
              key={`${event.event}-${event.date}`}
              className="text-sm text-muted-foreground"
            >
              {eventPlace(event)} ·{' '}
              <time dateTime={event.date}>{formatDate(event.date)}</time>
            </li>
          ))}
        </ul>
      )}

      {talk.resource && <TalkResourcePreview {...talk.resource} />}
    </DetailPage>
  )
}
