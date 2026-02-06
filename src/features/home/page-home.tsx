import { ArticlesSection } from '@/features/home/articles-section'
import { EventsSection } from '@/features/home/events-section'
import { ProjectsSection } from '@/features/home/projects-section'
import { Hero, HeroSubtitle, HeroTitle } from '@/layout/hero'

export function PageHome() {
  return (
    <div>
      <Hero>
        <HeroTitle className="">Noé Tatoud</HeroTitle>
        <HeroSubtitle>Frontend web developer</HeroSubtitle>
      </Hero>
      {/* <PicturesBento />*/}
      <ArticlesSection />
      <EventsSection />
      <ProjectsSection />
    </div>
  )
}
