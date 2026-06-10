import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Image } from '@/components/ui/image'
import { useAchievements } from '@/features/achievements/engine'
import { ExperiencesSection } from '@/features/experiences/experiences-section'
import { ArticlesSection } from '@/features/home/articles-section'
import { ProjectsSection } from '@/features/home/projects-section'
import { StageSection } from '@/features/home/stage-section'
import { SocialLinks } from '@/features/social/social-links'
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
        <HeroActions className="flex-wrap justify-center">
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
            render={<a href="/Noe_Tatoud_CV_React_EN.pdf" download />}
            nativeButton={false}
          >
            Download resume
          </Button>
        </HeroActions>
        <SocialLinks className="pt-2" />
      </Hero>
      <ArticlesSection />
      <ProjectsSection />
      <StageSection />
      <ExperiencesSection />
    </div>
  )
}
