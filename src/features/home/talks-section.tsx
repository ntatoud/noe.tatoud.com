import { useLoaderData } from '@tanstack/react-router'

import { TalksList } from '@/features/talks/talks-list'
import {
  Section,
  SectionContent,
  SectionHeader,
  SectionTitle,
} from '@/layout/section'

export function TalksSection() {
  const { talks } = useLoaderData({ from: '/' })
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Talks</SectionTitle>
      </SectionHeader>
      <SectionContent>
        <TalksList talks={talks} />
      </SectionContent>
    </Section>
  )
}
