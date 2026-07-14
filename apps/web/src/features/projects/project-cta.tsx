import type { ReactNode } from 'react'

import { ButtonAnchor } from '@/components/ui/button-link'
import { cn } from '@/lib/utils'

type ProjectCtaProps = {
  title: string
  children: ReactNode
  href: string
  buttonLabel: string
}

/**
 * A call-to-action block embeddable inside a Project MDX body (e.g. the
 * cowat project). Registered in the shared MDX component map
 * (`@/components/mdx/mdx-components`, issue #97) so it renders wherever a
 * Document body references `<ProjectCta />`.
 */
export function ProjectCta({
  title,
  children,
  href,
  buttonLabel,
}: ProjectCtaProps) {
  const isMailto = href.startsWith('mailto:')

  return (
    <div
      className={cn(
        'not-prose my-8 flex flex-col items-center gap-4 rounded-lg border border-border bg-card px-6 py-8 text-center sm:px-10 sm:py-10',
      )}
      data-slot="project-cta"
    >
      <p className="text-xl font-bold tracking-wide">{title}</p>
      <div className="max-w-md text-sm text-muted-foreground">{children}</div>
      <ButtonAnchor
        href={href}
        target={isMailto ? undefined : '_blank'}
        rel={isMailto ? undefined : 'noopener noreferrer'}
        size="lg"
      >
        {buttonLabel}
      </ButtonAnchor>
    </div>
  )
}

type ProjectInlineLinkProps = {
  href: string
  children: ReactNode
}

/**
 * An inline external link, styled as an outline button, embeddable inside a
 * Project MDX body (e.g. the start-ui-web project).
 */
export function ProjectInlineLink({ href, children }: ProjectInlineLinkProps) {
  return (
    <ButtonAnchor
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      variant="outline"
      size="lg"
      className="not-prose my-2 flex w-full"
    >
      {children}
    </ButtonAnchor>
  )
}
