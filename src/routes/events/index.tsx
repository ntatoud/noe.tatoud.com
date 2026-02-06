import { createFileRoute } from '@tanstack/react-router'
import { getEvents } from '@/features/events/get-events'
import { PageEvents } from '@/features/events/page-events'

export const Route = createFileRoute('/events/')({
  loader: () => getEvents(),
  component: PageEvents,
})
