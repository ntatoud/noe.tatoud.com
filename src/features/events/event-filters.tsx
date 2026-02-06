import type { ParticipationType } from '@/features/events/schemas'
import { Badge } from '@/components/ui/badge'
import {
  PARTICIPATION_LABELS,
  PARTICIPATION_TYPES,
} from '@/features/events/schemas'

interface EventFiltersProps {
  activeFilters: Set<ParticipationType>
  onToggle: (type: ParticipationType) => void
  eventCount: number
}

export function EventFilters({
  activeFilters,
  onToggle,
  eventCount,
}: EventFiltersProps) {
  return (
    <div className="flex w-full flex-wrap items-center gap-2 py-4">
      {PARTICIPATION_TYPES.map((type) => {
        const isActive = activeFilters.size === 0 || activeFilters.has(type)
        return (
          <Badge
            key={type}
            render={<button type="button" />}
            variant={isActive ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => onToggle(type)}
          >
            {PARTICIPATION_LABELS[type]}
          </Badge>
        )
      })}
      <span className="ml-auto text-sm text-muted-foreground">
        {eventCount} event{eventCount !== 1 ? 's' : ''}
      </span>
    </div>
  )
}
