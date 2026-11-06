import { useId, type ReactNode } from 'react'

type MoreSectionProps<T> = {
  title: string
  slot: string
  items: readonly T[]
  render: (item: T) => ReactNode
}

export function MoreSection<T>({
  title,
  slot,
  items,
  render,
}: MoreSectionProps<T>) {
  const titleId = useId()
  if (items.length === 0) return null
  return (
    <section className="mt-16" aria-labelledby={titleId} data-slot={slot}>
      <h2 id={titleId} className="text-2xl sm:text-3xl">
        {title}
      </h2>
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map(render)}
      </ul>
    </section>
  )
}
