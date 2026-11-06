import { ArrowRight02Icon, Mail01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { ButtonAnchor, ButtonLink } from '@/components/ui/button-link'
import { emailHref } from '@/layout/site-config'

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden" data-slot="home-hero">
      <span
        className="hero-monogram pointer-events-none -z-10 hidden lg:block"
        aria-hidden
        data-slot="hero-monogram"
      >
        N
      </span>
      <div className="mx-auto max-w-5xl px-4 pt-10 pb-4 sm:pt-24 sm:pb-16">
        <div className="max-w-2xl">
          <h1
            className="text-5xl leading-none tracking-tight text-balance sm:text-7xl"
            data-slot="hero-name"
          >
            Hi, I'm <span className="text-primary">Noé</span>
            <span className="text-secondary">.</span>
          </h1>
          <div className="mt-6 flex flex-col gap-4 text-lg text-pretty text-muted-foreground sm:text-xl">
            <p className="text-foreground">
              I'm a developer who loves the satisfaction of solving a tricky
              problem myself. These days agents write most of my code, so I am
              learning to put that care into the thinking behind it instead.
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
        </div>
      </div>
    </section>
  )
}
