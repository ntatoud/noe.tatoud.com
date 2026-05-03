import { useLoaderData } from '@tanstack/react-router'

import { TalksList } from '@/features/talks/talks-list'
import { Hero, HeroSubtitle, HeroTitle } from '@/layout/hero'
import { Section, SectionContent } from '@/layout/section'

export function PageTalks() {
  const { talks } = useLoaderData({ from: '/stage/' })

  return (
    <div>
      <Hero className="pb-16">
        <HeroTitle>Stage</HeroTitle>
        <HeroSubtitle>
          Talks, workshops, and sessions I've given at conferences and meetups.
        </HeroSubtitle>
      </Hero>

      <Section>
        <SectionContent>
          <TalksList talks={talks} />
        </SectionContent>
      </Section>
    </div>
  )
}
