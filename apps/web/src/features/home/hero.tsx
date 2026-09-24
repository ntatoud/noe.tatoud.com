import type { Experience } from '@ntatoud/content'

import { ButtonLink } from '@/components/ui/button-link'
import { SocialLinks } from '@/layout/social-links'

const firstName = 'Noé'
const lastName = 'Tatoud'
const tagline =
  'Fullstack developer crafting pixel-perfect interfaces and thoughtful web experiences.'

type HeroProps = {
  /** The ongoing role, shown as a status line above the name. */
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
        {firstName[0]}
      </span>
      <div className="mx-auto max-w-5xl px-4 pt-24 pb-16 sm:pt-32 sm:pb-24">
        {current && (
          <p
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-sm text-muted-foreground backdrop-blur-sm"
            data-slot="hero-status"
          >
            <span className="size-2 rounded-full bg-secondary" aria-hidden />
            {current.title} at{' '}
            <span className="font-medium text-foreground">
              {current.organization}
            </span>
          </p>
        )}
        <h1
          className="mt-8 text-6xl leading-none tracking-tight sm:text-8xl"
          data-slot="hero-name"
        >
          <span className="block">{firstName}</span>
          <span className="block text-primary">
            {lastName}
            <span className="text-secondary">.</span>
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
          {tagline}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <ButtonLink to="/blog" size="lg" data-slot="hero-cta-blog">
            Read the blog
          </ButtonLink>
          <SocialLinks />
        </div>
      </div>
    </section>
  )
}
