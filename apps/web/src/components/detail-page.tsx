import type { ComponentProps, ReactNode } from 'react'

import { ArrowLeft02Icon, ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Badge } from '@/components/ui/badge'
import { ButtonAnchor, ButtonLink } from '@/components/ui/button-link'
import type { RouteTo } from '@/lib/routes'

type DetailPageProps = {
  slot: 'blog-post' | 'project' | 'talk'
  back: { to: RouteTo; label: string }
  title: string
  badge?: string
  byline?: ReactNode
  description?: string
  tags?: ReadonlyArray<string>
  html: string
  children?: ReactNode
  footer?: ReactNode
}

export function DetailPage({
  slot,
  back,
  title,
  badge,
  byline,
  description,
  tags,
  html,
  children,
  footer,
}: DetailPageProps) {
  return (
    <main
      id="main"
      className="mx-auto w-full min-w-0 max-w-3xl px-4 py-12"
      data-slot={`${slot}-page`}
    >
      <ButtonLink to={back.to} variant="ghost" size="sm">
        <HugeiconsIcon
          icon={ArrowLeft02Icon}
          size={16}
          data-icon="inline-start"
        />
        {back.label}
      </ButtonLink>
      <div className="mt-6 flex items-center gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {badge && <Badge>{badge}</Badge>}
      </div>
      {byline && <p className="mt-2 text-sm text-muted-foreground">{byline}</p>}
      {description && (
        <p className="mt-2 text-muted-foreground">{description}</p>
      )}

      {tags && tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {children}

      <div
        className="typeset typeset-docs mt-8"
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
      variant="ghost"
      size="sm"
      {...props}
    >
      {children}
      <HugeiconsIcon icon={ArrowRight02Icon} size={16} data-icon="inline-end" />
    </ButtonAnchor>
  )
}
