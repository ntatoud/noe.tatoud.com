import { useId, type ReactNode } from 'react'

type MoreSectionProps = {
  title: string
  slot: string
  children: ReactNode
}

export function MoreSection({ title, slot, children }: MoreSectionProps) {
  const titleId = useId()
  return (
    <section className="mt-16" aria-labelledby={titleId} data-slot={slot}>
      <h2 id={titleId} className="text-2xl sm:text-3xl">
        {title}
      </h2>
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</ul>
    </section>
  )
}
