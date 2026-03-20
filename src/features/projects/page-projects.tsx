import { useLoaderData } from '@tanstack/react-router'
import { ProjectsList } from '@/features/projects/projects-list'
import { Hero, HeroSubtitle, HeroTitle } from '@/layout/hero'
import { Section, SectionContent } from '@/layout/section'

export function PageProjects() {
  const { projects } = useLoaderData({ from: '/projects/' })

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
          <ProjectsList projects={projects} enableKeyboardNav />
        </SectionContent>
      </Section>
    </div>
  )
}
