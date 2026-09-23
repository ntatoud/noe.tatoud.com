import type { StageItem } from '@ntatoud/content'

import { Mic01Icon, Wrench01Icon } from '@hugeicons/core-free-icons'

import {
  CardDescription,
  CardTags,
  CardTitle,
  ContentCard,
} from '@/components/content-card'
import { KindChip } from '@/components/kind-chip'
import { formatMonthYear, initials } from '@/lib/format'

type TalkCardProps = {
  talk: StageItem
}

export function TalkCard({ talk }: TalkCardProps) {
  const event = talk.events[0]
  const isWorkshop = talk.kind === 'workshop'

  return (
    <ContentCard slot="talk-card" href={talk.path}>
      <div className="flex items-center justify-between gap-2">
        <KindChip
          icon={isWorkshop ? Wrench01Icon : Mic01Icon}
          label={isWorkshop ? 'Workshop' : 'Talk'}
          tone={isWorkshop ? 'moss' : 'honey'}
        />
        {event && (
          <time className="text-xs text-muted-foreground tabular-nums">
            {formatMonthYear(event.date)}
          </time>
        )}
      </div>
      <CardTitle>{talk.title}</CardTitle>
      <CardDescription>{talk.description}</CardDescription>
      <CardTags tags={talk.tags} pinToBottom={false} />
      {event && (
        <div className="mt-auto flex items-center gap-2 border-t border-border/50 pt-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border/50 bg-gradient-to-br from-moss-500 to-honey-500 text-2xs font-bold text-white transition-transform duration-200 ease-out group-hover:scale-110 group-hover:rotate-3">
            {event.logo ? (
              <img
                src={event.logo}
                alt=""
                width={32}
                height={32}
                className="size-full rounded-md object-cover"
              />
            ) : (
              initials(event.event)
            )}
          </span>
          <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
            {event.event} · {event.city}
          </span>
        </div>
      )}
    </ContentCard>
  )
}
