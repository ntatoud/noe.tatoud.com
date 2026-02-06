import { ArrowRight } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import {
  Section,
  SectionActions,
  SectionContent,
  SectionHeader,
  SectionTitle,
} from '@/layout/section'
import { events } from '@/features/events/events-data'
import { EventsMap } from '@/features/events/events-map'

export function EventsSection() {
  return (
    <Section className="max-w-5xl">
      <SectionHeader>
        <SectionTitle>Events</SectionTitle>
        <SectionActions>
          <Button
            variant="ghost"
            size="lg"
            render={<Link to="/events" />}
            nativeButton={false}
          >
            See more <HugeiconsIcon icon={ArrowRight} />
          </Button>
        </SectionActions>
      </SectionHeader>
      <SectionContent>
        <EventsMap events={events} />
      </SectionContent>
    </Section>
  )
}
