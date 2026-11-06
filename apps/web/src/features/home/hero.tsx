import { Link } from '@tanstack/react-router'

import { ArrowRight02Icon, Mail01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { ButtonAnchor, ButtonLink } from '@/components/ui/button-link'
import { emailHref } from '@/layout/site-config'
import { SocialLinks } from '@/layout/social-links'

const START_HERE = 'how-is-ai-changing-the-way-i-work-as-a-developer'

const inlineLink =
  'rounded-sm text-foreground underline decoration-primary/50 underline-offset-4 outline-none hover:decoration-primary focus-visible:ring-3 focus-visible:ring-ring'

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden" data-slot="home-hero">
      <span
        className="hero-monogram pointer-events-none -z-10 hidden md:block"
        aria-hidden
        data-slot="hero-monogram"
      >
        N
      </span>
      <div className="mx-auto max-w-5xl px-4 pt-16 pb-4 sm:pt-24 sm:pb-16">
        <div className="max-w-2xl">
          <h1
            className="text-5xl leading-none tracking-tight text-balance sm:text-7xl"
            data-slot="hero-name"
          >
            Hi, I'm <span className="text-primary">Noé</span>
            <span className="text-secondary">.</span>
          </h1>
          <div className="mt-6 flex flex-col gap-4 text-lg text-pretty text-muted-foreground sm:text-xl">
            <p>
              I'm a fullstack developer who has always loved writing code. These
              days agents write most of it, and that has not been an easy shift.
            </p>
            <p>
              <Link
                to="/blog/$slug"
                params={{ slug: START_HERE }}
                className={inlineLink}
              >
                I wrote about that shift
              </Link>
              , a good place to start. I also give{' '}
              <Link to="/talks" className={inlineLink}>
                talks and workshops
              </Link>
              , from growing a React component library to teaching kids to code
              with{' '}
              <a href="https://www.forkit.community" className={inlineLink}>
                Fork it!
              </a>
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
          <SocialLinks className="mt-6 -ml-2" withEmail={false} />
        </div>
      </div>
    </section>
  )
}
