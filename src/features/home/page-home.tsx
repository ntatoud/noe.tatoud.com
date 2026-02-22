import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ExperiencesSection } from '@/features/experiences/experiences-section'
import { ArticlesSection } from '@/features/home/articles-section'
import { ProjectsSection } from '@/features/home/projects-section'
import { Hero, HeroActions, HeroSubtitle, HeroTitle } from '@/layout/hero'

export function PageHome() {
  return (
    <div>
      <Hero className="pb-16">
        <HeroTitle>Noé Tatoud</HeroTitle>
        <HeroSubtitle>
          Frontend developer crafting pixel-perfect interfaces
          <br />
          and thoughtful web experiences.
        </HeroSubtitle>
        <HeroActions>
          <Button
            size="lg"
            render={<Link to="/blog" />}
            nativeButton={false}
            variant="outline"
          >
            Read the blog
          </Button>
          <Button
            size="lg"
            render={<a href="mailto:noe.tatoud@gmail.com" />}
            nativeButton={false}
          >
            Get in touch
          </Button>
        </HeroActions>
        <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
          <a
            href="https://github.com/ntatoud"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono tracking-widest uppercase transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <span className="text-border">·</span>
          <a
            href="https://linkedin.com/in/noe-tatoud"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono tracking-widest uppercase transition-colors hover:text-foreground"
          >
            LinkedIn
          </a>
          <span className="text-border">·</span>
          <a
            href="mailto:noe.tatoud@gmail.com"
            className="font-mono tracking-widest uppercase transition-colors hover:text-foreground"
          >
            Email
          </a>
        </div>
      </Hero>
      <ArticlesSection />
      <ProjectsSection />
      <ExperiencesSection />
    </div>
  )
}
