import { Badge } from '@/components/ui/badge'
import { type StageItem, type StageEvent } from '@/lib/content'
import { formatDate } from '@/lib/format'

import { Slice } from './slice'

type TalksSliceProps = {
  talks: StageItem[]
}

/** Returns the event with the most recent date, or undefined. */
function latestEvent(
  events: Array<StageEvent> | undefined,
): StageEvent | undefined {
  if (!events || events.length === 0) return undefined
  return events.reduce((latest, e) =>
    new Date(e.date) > new Date(latest.date) ? e : latest,
  )
}

export function TalksSlice({ talks }: TalksSliceProps) {
  const recent = talks.slice(0, 2)

  return (
    <Slice title="Talks" seeAllHref="/talks" data-slot="talks-slice">
      <ul className="flex flex-col divide-y divide-border">
        {recent.map((talk) => {
          const event = latestEvent(talk.events)
          const href = `/talks/${talk.slug}`
          return (
            <li key={talk.slug} className="py-4">
              <a
                href={href}
                className="group flex flex-col gap-1"
                data-slot="talk-link"
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-medium group-hover:underline">
                    {talk.title}
                  </h3>
                  <Badge>{talk.kind}</Badge>
                </div>
                {event && (
                  <p className="text-sm text-muted-foreground">
                    {event.event} — {event.city} · {formatDate(event.date)}
                  </p>
                )}
              </a>
            </li>
          )
        })}
      </ul>
    </Slice>
  )
}
