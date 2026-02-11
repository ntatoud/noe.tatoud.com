import { useLoaderData } from '@tanstack/react-router'

import {
  Section,
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
        <SectionTitle className="mr-auto">Projects</SectionTitle>
      </SectionHeader>
      <SectionContent>
        <ProjectsList projects={projects} />
      </SectionContent>
    </Section>
  )
}
