import type { Project } from '@/features/projects/get-projects'
import { ProjectsList } from '@/features/projects/projects-list'
import { Hero, HeroSubtitle, HeroTitle } from '@/layout/hero'
import { Section, SectionContent } from '@/layout/section'

export function PageProjects({ projects }: { projects: Array<Project> }) {
  return (
    <div>
      <Hero className="pb-16">
        <HeroTitle>Projects</HeroTitle>
        <HeroSubtitle>
          Open-source projects and contributions I've been involved in.
        </HeroSubtitle>
      </Hero>

      <Section>
        <SectionContent>
          <ProjectsList projects={projects} />
        </SectionContent>
      </Section>
    </div>
  )
}
