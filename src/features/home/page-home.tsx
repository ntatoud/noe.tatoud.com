import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Image } from '@/components/ui/image'
import { useAchievements } from '@/features/achievements/engine'
import { ExperiencesSection } from '@/features/experiences/experiences-section'
import { ArticlesSection } from '@/features/home/articles-section'
import { ProjectsSection } from '@/features/home/projects-section'
import { socialLinks } from '@/features/social/social-links'
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
            render={
              <a href={socialLinks.find((l) => l.id === 'email')?.href} />
            }
            nativeButton={false}
            onClick={() => unlock('social')}
          >
            Get in touch
          </Button>
        </HeroActions>
        <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
          {socialLinks
            .filter((l) => l.id !== 'email')
            .flatMap((link, i, arr) => [
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono tracking-widest uppercase transition-colors hover:text-foreground"
                onClick={() => unlock('social')}
              >
                {link.label}
              </a>,
              ...(i < arr.length - 1
                ? [
                    <span key={`sep-${link.id}`} className="text-border">
                      ·
                    </span>,
                  ]
                : []),
            ])}
        </div>
      </Hero>
      <ArticlesSection />
      <ProjectsSection />
      <ExperiencesSection />
    </div>
  )
}
