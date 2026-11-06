import type { ComponentProps, ReactNode } from 'react'

import { Link } from '@tanstack/react-router'

import { ArrowLeft02Icon, ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Badge } from '@/components/ui/badge'
import { ButtonAnchor, ButtonLink } from '@/components/ui/button-link'
import type { RouteTo } from '@/lib/routes'
import type { sharedElement } from '@/lib/view-transition'

type DetailPageProps = {
  slot: 'blog-post' | 'project' | 'talk'
  back: { to: RouteTo; label: string }
  title: string
  titleTransition?: ReturnType<typeof sharedElement>
  badge?: ReactNode
  byline?: ReactNode
  description?: string
  tags?: ReadonlyArray<string>
  linkTags?: boolean
  html: string
  children?: ReactNode
  footer?: ReactNode
}

export function DetailPage({
  slot,
  back,
  title,
  titleTransition,
  badge,
  byline,
  description,
  tags,
  linkTags = false,
  html,
  children,
  footer,
}: DetailPageProps) {
  return (
    <main
      id="main"
      className="mx-auto w-full max-w-2xl min-w-0 px-4 pt-8 pb-20 sm:pt-12"
      data-slot={`${slot}-page`}
    >
      <ButtonLink to={back.to} variant="muted" size="sm" className="-ml-3">
        <HugeiconsIcon
          icon={ArrowLeft02Icon}
          size={16}
          data-icon="inline-start"
        />
        {back.label}
      </ButtonLink>
      <header className="mt-8 flex flex-col gap-4">
        {badge && <div className="self-start">{badge}</div>}
        <h1
          {...titleTransition}
          className="text-3xl leading-tight tracking-tight text-balance sm:text-5xl"
        >
          {title}
        </h1>
        {description && (
          <p className="text-lg text-pretty text-muted-foreground sm:text-xl">
            {description}
          </p>
        )}
        {byline}
        {tags && tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
            {tags.map((tag) => (
              <li key={tag}>
                {linkTags ? (
                  <Link
                    to="/blog"
                    search={{ tag }}
                    className="inline-flex min-h-6 items-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring [&>span]:hover:border-primary [&>span]:hover:text-foreground"
                  >
                    <Badge variant="outline">{tag}</Badge>
                  </Link>
                ) : (
                  <Badge variant="outline">{tag}</Badge>
                )}
              </li>
            ))}
          </ul>
        )}
      </header>

      {children}

      <div
        className="typeset typeset-docs mt-10"
        data-slot={`${slot}-content`}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {footer}
    </main>
  )
}

export function ExternalLinkButton({
  children,
  ...props
}: Omit<ComponentProps<typeof ButtonAnchor>, 'target' | 'rel'>) {
  return (
    <ButtonAnchor
      target="_blank"
      rel="noopener noreferrer"
      variant="outline"
      size="sm"
      {...props}
    >
      {children}
      <HugeiconsIcon icon={ArrowRight02Icon} size={16} data-icon="inline-end" />
    </ButtonAnchor>
  )
}
