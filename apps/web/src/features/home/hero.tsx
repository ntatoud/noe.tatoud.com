import type { Experience } from '@ntatoud/content'

import { ArrowRight02Icon, Mail01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { ButtonAnchor, ButtonLink } from '@/components/ui/button-link'
import { emailHref } from '@/layout/site-config'
import { SocialLinks } from '@/layout/social-links'

type HeroProps = {
  current?: Experience
}

export function Hero({ current }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden" data-slot="home-hero">
      <span
        className="hero-monogram pointer-events-none -z-10 hidden lg:block"
        aria-hidden
        data-slot="hero-monogram"
      >
        N
      </span>
      <div className="mx-auto max-w-5xl px-4 pt-16 pb-16 sm:pt-24 sm:pb-24">
        <div className="max-w-2xl">
          {current && (
            <p
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-sm text-muted-foreground backdrop-blur-sm"
              data-slot="hero-status"
            >
              <span className="relative flex size-2" aria-hidden>
                <span className="absolute inline-flex size-full rounded-full bg-secondary opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex size-2 rounded-full bg-secondary" />
              </span>
              Currently {current.title} at{' '}
              <span className="font-medium text-foreground">
                {current.organization}
              </span>
            </p>
          )}
          <h1
            className="mt-6 text-5xl leading-none tracking-tight text-balance sm:text-7xl"
            data-slot="hero-name"
          >
            Hi, I'm <span className="text-primary">Noé</span>
            <span className="text-secondary">.</span>
          </h1>
          <div className="mt-6 flex flex-col gap-4 text-lg text-pretty text-muted-foreground sm:text-xl">
            <p>
              I'm a fullstack developer who cares about interfaces that feel
              good to use, down to the last pixel.
            </p>
            <p>
              Here I write about what I learn along the way: tooling, AI in my
              daily work, and the talks and workshops I give, from growing a
              React component library to teaching kids to code with the{' '}
              <span className="text-foreground">Fork it!</span> community.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink to="/blog" size="lg" data-slot="hero-cta-blog">
              Read the blog
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                size={18}
                data-icon="inline-end"
              />
            </ButtonLink>
            <ButtonAnchor
              href={emailHref()}
              variant="outline"
              size="lg"
              data-slot="hero-cta-email"
            >
              <HugeiconsIcon
                icon={Mail01Icon}
                size={18}
                data-icon="inline-start"
              />
              Say hello
            </ButtonAnchor>
          </div>
          <SocialLinks className="mt-6 -ml-2" />
        </div>
      </div>
    </section>
  )
}
