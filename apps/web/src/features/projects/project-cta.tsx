import type { ProjectCtaFrontmatter } from '@ntatoud/content'

import { ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { ButtonAnchor } from '@/components/ui/button-link'

export function ProjectCta({
  title,
  description,
  href,
  buttonLabel,
}: ProjectCtaFrontmatter) {
  return (
    <aside
      className="mt-10 rounded-lg border border-border bg-card p-6"
      data-slot="project-cta"
    >
      <p className="text-lg font-semibold tracking-tight">{title}</p>
      {description && (
        <div className="mt-2 text-sm text-muted-foreground">{description}</div>
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
