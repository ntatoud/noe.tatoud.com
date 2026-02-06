import { EventFilters } from '@/features/events/event-filters'
import { events } from '@/features/events/events-data'
import { EventsMap } from '@/features/events/events-map'
import { useEventFilters } from '@/features/events/use-event-filters'
import { Hero, HeroSubtitle, HeroTitle } from '@/layout/hero'
import { Section, SectionContent } from '@/layout/section'

export function PageEvents() {
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
