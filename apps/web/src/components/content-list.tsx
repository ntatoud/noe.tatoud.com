import { cn } from '@/lib/utils'

type ContentListItem = {
  key: string
  href?: string
  title: string
  external?: boolean
}

type ContentListProps = {
  items: ContentListItem[]
  className?: string
}

export function ContentList({ items, className }: ContentListProps) {
  return (
    <ul
      className={cn('flex flex-col gap-2', className)}
      data-slot="content-list"
    >
      {items.map((item) => (
        <li key={item.key}>
          {item.href ? (
            <a
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noreferrer' : undefined}
              className="text-sm text-foreground underline-offset-4 hover:underline"
              data-slot="content-list-link"
            >
              {item.title}
            </a>
          ) : (
            <span
              className="text-sm text-foreground"
              data-slot="content-list-item"
            >
              {item.title}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}
