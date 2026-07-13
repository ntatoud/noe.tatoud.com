import { Link } from '@tanstack/react-router'

import type { RouteTo } from '@/lib/routes'
import { cn } from '@/lib/utils'

type SliceProps = {
  title: string
  seeAllHref: RouteTo
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
      className={cn('mx-auto max-w-5xl px-4 py-8', className)}
      data-slot="home-slice"
    >
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Link
          to={seeAllHref}
          className="text-sm text-muted-foreground hover:text-foreground"
          data-slot="slice-see-all"
        >
          {seeAllLabel} →
        </Link>
      </div>
      {children}
    </section>
  )
}
