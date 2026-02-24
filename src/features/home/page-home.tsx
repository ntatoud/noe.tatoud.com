import { Link } from '@tanstack/react-router'
import { useAchievements } from '@/features/achievements/use-achievements'
import { Button } from '@/components/ui/button'
import { Image } from '@/components/ui/image'
import { ExperiencesSection } from '@/features/experiences/experiences-section'
import { ArticlesSection } from '@/features/home/articles-section'
import { ProjectsSection } from '@/features/home/projects-section'
import { Hero, HeroActions, HeroSubtitle, HeroTitle } from '@/layout/hero'

export function PageHome() {
  const { unlock } = useAchievements()

  return (
    <div>
      <Hero className="pb-16">
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => unlock('pixel-clicker')}
          className="cursor-pointer appearance-none border-0 bg-transparent p-0"
        >
          <Image
            src="/pixel-avatar.png"
            alt="Pixel art portrait of Noé Tatoud"
            width={160}
            height={160}
            priority
            widths={[160, 320]}
            sizes="160px"
            className="mb-1 select-none"
            style={{
              imageRendering: 'pixelated',
              maskImage:
                'radial-gradient(ellipse 55% 60% at 50% 40%, black 40%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 55% 60% at 50% 40%, black 40%, transparent 100%)',
            }}
            draggable={false}
          />
        </button>
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
            onClick={() => unlock('social')}
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
            onClick={() => unlock('social')}
          >
            GitHub
          </a>
          <span className="text-border">·</span>
          <a
            href="https://linkedin.com/in/noetatoud"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono tracking-widest uppercase transition-colors hover:text-foreground"
            onClick={() => unlock('social')}
          >
            LinkedIn
          </a>
          <span className="text-border">·</span>
          <a
            href="mailto:noe.tatoud@gmail.com"
            className="font-mono tracking-widest uppercase transition-colors hover:text-foreground"
            onClick={() => unlock('social')}
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
