import { ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { ButtonLink } from '@/components/ui/button-link'
import type { RouteTo } from '@/lib/routes'

type SliceProps = {
  slot: string
  title: string
  description?: string
  seeAll?: { href: RouteTo; label: string }
  children: React.ReactNode
}

export function Slice({
  slot,
  title,
  description,
  seeAll,
  children,
}: SliceProps) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:py-16" data-slot={slot}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl sm:text-4xl">{title}</h2>
          {description && (
            <p className="max-w-xl text-pretty text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {seeAll && (
          <ButtonLink
            to={seeAll.href}
            className="-ml-3 sm:ml-0"
            variant="muted"
            size="sm"
            data-slot="slice-see-all"
          >
            {seeAll.label}
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
