import { Button } from '@/components/ui/button'
import { ArticlesSection } from '@/features/home/articles-section'
import { ProjectsSection } from '@/features/home/projects-section'
import { Hero, HeroActions, HeroSubtitle, HeroTitle } from '@/layout/hero'

export function PageHome() {
  return (
    <div>
      <Hero>
        <HeroTitle>Noé Tatoud</HeroTitle>
        <HeroSubtitle>Frontend web developer</HeroSubtitle>
        <HeroActions>
          <Button size="lg" render={<a href="mailto:noe.tatoud@gmail.com" />}>
            Get in touch
          </Button>
        </HeroActions>
      </Hero>
      <ArticlesSection />
      <ProjectsSection />
    </div>
  )
}
