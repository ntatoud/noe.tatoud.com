import type { StageItem, TalkEvent } from '@ntatoud/content'

import { Mic01Icon, Wrench01Icon } from '@hugeicons/core-free-icons'

import { KindChip } from '@/components/kind-chip'
import { Badge } from '@/components/ui/badge'
import { formatMonthYear, initials } from '@/lib/format'

type TalkCardProps = {
  talk: StageItem
}

function latestEvent(events: ReadonlyArray<TalkEvent>): TalkEvent | undefined {
  if (events.length === 0) return undefined
  return events.reduce((latest, event) =>
    new Date(event.date) > new Date(latest.date) ? event : latest,
  )
}

export function TalkCard({ talk }: TalkCardProps) {
  const event = latestEvent(talk.events)
  const isWorkshop = talk.kind === 'workshop'

  return (
    <li data-slot="talk-card">
      <a
        href={`/talks/${talk.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card outline-none transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-lg hover:shadow-black/5 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:hover:shadow-black/20"
      >
        <div className="flex flex-1 flex-col gap-2 p-4">
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
          <h3 className="line-clamp-2 min-h-[2lh] font-semibold tracking-tight text-foreground underline-offset-4 group-hover:underline">
            {talk.title}
          </h3>
          <p className="line-clamp-2 min-h-[2lh] text-sm text-muted-foreground">
            {talk.description}
          </p>
          <div className="flex min-h-[22px] flex-wrap gap-1 pt-2">
            {talk.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          {event && (
            <div className="mt-auto flex items-center gap-2 border-t border-border/50 pt-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border/50 bg-gradient-to-br from-moss-500 to-honey-500 text-[10px] font-bold text-white transition-transform duration-200 ease-out group-hover:scale-110 group-hover:rotate-3">
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
        </div>
      </a>
    </li>
  )
}
