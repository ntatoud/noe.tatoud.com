import { Button } from '@/components/ui/button'
import { ArticlesSection } from '@/features/home/articles-section'
import { ProjectsSection } from '@/features/home/projects-section'
import { Hero, HeroActions, HeroSubtitle, HeroTitle } from '@/layout/hero'

export function PageHome() {
  return (
    <div>
      <Hero className="pb-16">
        <HeroTitle>Noé Tatoud</HeroTitle>
        <HeroSubtitle>Frontend web developer</HeroSubtitle>
        <HeroActions>
          <Button
            size="lg"
            render={<a href="mailto:noe.tatoud@gmail.com" />}
            nativeButton={false}
          >
            Get in touch
          </Button>
          <Button size="lg" variant="secondary">
            Test
          </Button>
        </HeroActions>
      </Hero>
      <ArticlesSection />
      <ProjectsSection />
    </div>
  )
}
