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
      className="mt-16 flex flex-col gap-3 rounded-3xl border border-clay-200/70 bg-clay-50 p-6 sm:p-8 dark:border-clay-900 dark:bg-clay-950/60"
      data-slot="project-cta"
    >
      <h2 className="text-2xl sm:text-3xl">{title}</h2>
      {description && (
        <div className="max-w-prose text-base text-pretty text-muted-foreground sm:text-lg">
          {description}
        </div>
      )}
      <div className="mt-2">
        <ButtonAnchor href={href} size="lg">
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
