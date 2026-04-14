import { useLoaderData } from '@tanstack/react-router'

import { ProjectsList } from '@/features/projects/projects-list'
import {
  Section,
  SectionContent,
  SectionHeader,
  SectionTitle,
} from '@/layout/section'

export function ProjectsSection() {
  const { projects } = useLoaderData({ from: '/' })
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Projects</SectionTitle>
      </SectionHeader>
      <SectionContent>
        <ProjectsList projects={projects} />
      </SectionContent>
    </Section>
  )
}
