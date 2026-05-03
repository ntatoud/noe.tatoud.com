import { useLoaderData } from '@tanstack/react-router'

import { StageList } from '@/features/talks/stage-list'
import { Hero, HeroSubtitle, HeroTitle } from '@/layout/hero'
import { Section, SectionContent } from '@/layout/section'

export function PageStage() {
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
          <StageList talks={talks} />
        </SectionContent>
      </Section>
    </div>
  )
}
