import { useLoaderData } from '@tanstack/react-router'
import { EventsMap } from '@/features/events/events-map'

export function EventsSection() {
  const { events } = useLoaderData({ from: '/' })

  return <EventsMap events={events} />
}
