import {
  ArrowRight02Icon,
  ArrowUpRight01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { ButtonAnchor } from '@/components/ui/button-link'

/**
 * Components a project MDX body may use. Content files cannot import anything
 * themselves, so this map is handed to `withBodyHtml` in
 * `apps/web/src/server/content.tsx` — see the "Custom components in MDX" note in
 * CLAUDE.md.
 */

/** A closing call-to-action block, e.g. "Want Cowat for your team?". */
export function ProjectCta({
  title,
  href,
  buttonLabel,
  children,
}: {
  title: string
  href: string
  buttonLabel: string
  children?: React.ReactNode
}) {
  return (
    <aside
      className="mt-10 rounded-lg border border-border bg-card p-6"
      data-slot="project-cta"
    >
      <p className="text-lg font-semibold tracking-tight">{title}</p>
      {children && (
        <div className="mt-2 text-sm text-muted-foreground">{children}</div>
      )}
      <div className="mt-4">
        <ButtonAnchor href={href} variant="default" size="sm">
          {buttonLabel}
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            size={16}
            data-icon="inline-end"
          />
        </ButtonAnchor>
      </div>
    </aside>
  )
}

/** A standalone outbound link that reads as a button rather than inline prose. */
export function ProjectInlineLink({
  href,
  children,
}: {
  href: string
  children?: React.ReactNode
}) {
  return (
    <ButtonAnchor
      href={href}
      variant="outline"
      size="sm"
      target="_blank"
      rel="noreferrer noopener"
      data-slot="project-inline-link"
    >
      {children}
      <HugeiconsIcon
        icon={ArrowUpRight01Icon}
        size={16}
        data-icon="inline-end"
      />
    </ButtonAnchor>
  )
}
