import { ArrowRight, Calendar, Location } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { TechEvent } from '@/features/events/get-events'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { formatDate } from '@/lib/format'
import { PARTICIPATION_LABELS } from '@/features/events/schemas'

export function EventCard({ event }: { event: TechEvent }) {
  return (
    <div className="space-y-2 p-3">
      <div className="flex flex-col gap-1.5">
        <h3 className="pr-4 font-head text-sm leading-tight font-semibold">
          {event.name}
        </h3>
        <Badge variant="outline" className="w-fit text-[10px]">
          {PARTICIPATION_LABELS[event.participationType]}
        </Badge>
      </div>
      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <HugeiconsIcon icon={Location} className="size-3 shrink-0" />
          {event.city}
        </span>
        <span className="flex items-center gap-1.5">
          <HugeiconsIcon icon={Calendar} className="size-3 shrink-0" />
          {formatDate(event.date)}
        </span>
      </div>
      {event.talkTitle && (
        <p className="text-xs text-muted-foreground italic">
          {event.talkTitle}
        </p>
      )}
      {event.url && (
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: 'link' })}
        >
          Event website
          <HugeiconsIcon icon={ArrowRight} className="size-3" />
        </a>
      )}
    </div>
  )
}
