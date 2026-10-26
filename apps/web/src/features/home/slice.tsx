import { ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { ButtonLink } from '@/components/ui/button-link'
import type { RouteTo } from '@/lib/routes'

type SliceProps = {
  /** `data-slot` of the section. */
  slot: string
  title: string
  seeAllHref?: RouteTo
  children: React.ReactNode
}

export function Slice({ slot, title, seeAllHref, children }: SliceProps) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:py-16" data-slot={slot}>
      <div className="mb-8 flex items-baseline justify-between">
        <h2 className="text-3xl">{title}</h2>
        {seeAllHref && (
          <ButtonLink
            to={seeAllHref}
            variant="muted"
            size="sm"
            data-slot="slice-see-all"
          >
            See all
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={16}
              data-icon="inline-end"
            />
          </ButtonLink>
        )}
      </div>
      {children}
    </section>
  )
}
