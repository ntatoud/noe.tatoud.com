import { useMemo, useState } from 'react'
import type {
  ParticipationType,
  TechEvent,
} from '@/features/events/events-data'

export function useEventFilters(events: Array<TechEvent>) {
  const [activeFilters, setActiveFilters] = useState<Set<ParticipationType>>(
    new Set(),
  )

  const toggleFilter = (type: ParticipationType) => {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(type)) {
        next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })
  }

  const filteredEvents = useMemo(() => {
    if (activeFilters.size === 0) return events
    return events.filter((e) => activeFilters.has(e.participationType))
  }, [events, activeFilters])

  return { filteredEvents, activeFilters, toggleFilter }
}
