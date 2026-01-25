import { ArrowRight } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import {
  Section,
  SectionActions,
  SectionContent,
  SectionHeader,
  SectionTitle,
} from '@/layout/section'

export function ProjectsSection() {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Projects</SectionTitle>
        <SectionActions>
          <Button variant="ghost" size="lg">
            See more <HugeiconsIcon icon={ArrowRight} />
          </Button>
        </SectionActions>
      </SectionHeader>
      <SectionContent>Some very cool projects I did</SectionContent>
    </Section>
  )
}
