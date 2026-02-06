import { useLoaderData } from '@tanstack/react-router'
import { EventFilters } from '@/features/events/event-filters'
import { EventsMap } from '@/features/events/events-map'
import { useEventFilters } from '@/features/events/use-event-filters'
import { Hero, HeroSubtitle, HeroTitle } from '@/layout/hero'
import { Section, SectionContent } from '@/layout/section'

export function PageEvents() {
  const events = useLoaderData({ from: '/events/' })
  const { filteredEvents, activeFilters, toggleFilter } =
    useEventFilters(events)

  return (
    <div>
      <Hero>
        <HeroTitle>Events</HeroTitle>
        <HeroSubtitle>
          Tech events I have attended, organized, and spoken at.
        </HeroSubtitle>
      </Hero>

      <Section className="max-w-5xl">
        <EventFilters
          activeFilters={activeFilters}
          onToggle={toggleFilter}
          eventCount={filteredEvents.length}
        />
        <SectionContent>
          <EventsMap events={filteredEvents} />
        </SectionContent>
      </Section>
    </div>
  )
}
