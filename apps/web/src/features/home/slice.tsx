import { ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { ButtonLink } from '@/components/ui/button-link'
import type { RouteTo } from '@/lib/routes'
import { cn } from '@/lib/utils'

type SliceProps = {
  title: string
  seeAllHref?: RouteTo
  seeAllLabel?: string
  className?: string
  children: React.ReactNode
}

export function Slice({
  title,
  seeAllHref,
  seeAllLabel = 'See all',
  className,
  children,
}: SliceProps) {
  return (
    <section
      className={cn('mx-auto max-w-5xl px-4 py-12 sm:py-16', className)}
      data-slot="home-slice"
    >
      <div className="mb-8 flex items-baseline justify-between">
        <h2 className="text-3xl">{title}</h2>
        {seeAllHref && (
          <ButtonLink
            to={seeAllHref}
            variant="muted"
            size="sm"
            data-slot="slice-see-all"
          >
            {seeAllLabel}
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
