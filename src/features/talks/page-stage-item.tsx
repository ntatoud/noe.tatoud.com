import { CardTags } from '@/components/ui/card-list'
import type { StageItem } from '@/features/talks/get-stage'
import type { StageEvent } from '@/features/talks/schemas'
import { SlideFrame } from '@/features/talks/slide-frame'
import { Hero, HeroTitle } from '@/layout/hero'
import { PageBreadcrumb } from '@/layout/page-breadcrumb'
import {
  Section,
  SectionContent,
  SectionHeader,
  SectionTitle,
} from '@/layout/section'
import { formatDate } from '@/lib/format'
import { sortEventsByDate } from '@/lib/stage'
import { cn } from '@/lib/utils'

function StageEventItem({ ev }: { ev: StageEvent }) {
  const Wrapper = ev.url ? 'a' : 'div'

  return (
    <Wrapper
      {...(ev.url && {
        href: ev.url,
        target: '_blank',
        rel: 'noopener noreferrer',
      })}
      className={cn(
        'flex items-center gap-4 py-4',
        ev.url && 'transition-opacity hover:opacity-70',
      )}
    >
      {ev.logo ? (
        <img
          src={ev.logo}
          alt={ev.event}
          width={40}
          height={40}
          className="size-10 shrink-0 object-contain clip-pixel"
        />
      ) : (
        <div className="size-10 shrink-0 bg-muted clip-pixel" />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-head text-base font-semibold tracking-wide uppercase">
          {ev.event}
        </span>
        <span className="text-sm text-muted-foreground">{ev.city}</span>
      </div>
      <time className="shrink-0 font-mono text-xs text-muted-foreground/60">
        {formatDate(ev.date)}
      </time>
    </Wrapper>
  )
}

export function PageTalk({ talk }: { talk: StageItem }) {
  const sortedEvents = sortEventsByDate(talk.events ?? [])

  return (
    <>
      <Hero className="pt-12 text-center">
        <PageBreadcrumb href="/stage" label="Stage" current={talk.title} />
        {talk.tags && talk.tags.length > 0 && <CardTags tags={talk.tags} />}
        <HeroTitle className="text-3xl sm:text-4xl">{talk.title}</HeroTitle>
      </Hero>

      <div className="mx-auto w-full max-w-2xl px-4 pt-6 sm:pt-8 md:px-0">
        <p className="leading-relaxed text-pretty text-muted-foreground">
          {talk.description}
        </p>
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-6">
        <SlideFrame resource={talk.resource} title={talk.title} />
      </div>

      {sortedEvents.length > 0 && (
        <Section className="mt-8 pt-0">
          <SectionHeader>
            <SectionTitle className="mr-auto">Presented at</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <div className="-my-4 flex w-full flex-col divide-y divide-border">
              {sortedEvents.map((ev) => (
                <StageEventItem key={`${ev.event}-${ev.date}`} ev={ev} />
              ))}
            </div>
          </SectionContent>
        </Section>
      )}
    </>
  )
}
