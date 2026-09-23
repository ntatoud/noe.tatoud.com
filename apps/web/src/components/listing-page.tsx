import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type ListingPageProps = {
  /** `data-slot` of the page; its grid gets `<slot>-list`. */
  slot: string
  title: string
  subtitle: string
  columns: 2 | 3
  children: ReactNode
}

/** The page shell shared by the blog, projects and talks listings. */
export function ListingPage({
  slot,
  title,
  subtitle,
  columns,
  children,
}: ListingPageProps) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12" data-slot={slot}>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-muted-foreground">{subtitle}</p>
      <ul
        className={cn(
          'mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2',
          columns === 3 && 'lg:grid-cols-3',
        )}
        data-slot={`${slot}-list`}
      >
        {children}
      </ul>
    </main>
  )
}
