import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type ListingPageProps = {
  slot: string
  title: string
  subtitle: string
  columns: 2 | 3
  children: ReactNode
}

export function ListingPage({
  slot,
  title,
  subtitle,
  columns,
  children,
}: ListingPageProps) {
  return (
    <main
      id="main"
      className="mx-auto max-w-5xl px-4 pt-12 pb-20 sm:pt-16"
      data-slot={slot}
    >
      <h1 className="text-4xl tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-pretty text-muted-foreground">
        {subtitle}
      </p>
      <ul
        className={cn(
          'mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2',
          columns === 3 && 'lg:grid-cols-3',
        )}
        data-slot={`${slot}-list`}
      >
        {children}
      </ul>
    </main>
  )
}
