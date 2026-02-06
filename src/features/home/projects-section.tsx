import { ArrowRight } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useLoaderData } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Section,
  SectionActions,
  SectionContent,
  SectionHeader,
  SectionTitle,
} from '@/layout/section'
import { ProjectsList } from '@/features/projects/projects-list'

export function ProjectsSection() {
  const { projects } = useLoaderData({ from: '/' })
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
      <SectionContent>
        <ProjectsList projects={projects} />
      </SectionContent>
    </Section>
  )
}
