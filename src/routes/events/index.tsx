import { createFileRoute } from '@tanstack/react-router'
import { PageEvents } from '@/features/events/page-events'

export const Route = createFileRoute('/events/')({
  component: PageEvents,
})
