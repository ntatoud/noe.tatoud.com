import { Link, useLoaderData } from '@tanstack/react-router'
import { PixelArrowRight } from '@/components/icons'
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
          <Button
            variant="ghost"
            className="px-2"
            render={<Link to="/projects" />}
            nativeButton={false}
          >
            All projects <PixelArrowRight size={16} aria-hidden />
          </Button>
        </SectionActions>
      </SectionHeader>
      <SectionContent>
        <ProjectsList projects={projects} />
      </SectionContent>
    </Section>
  )
}
