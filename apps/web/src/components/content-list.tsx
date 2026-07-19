import { cn } from '@/lib/utils'

type ContentListItem = {
  key: string
  href?: string
  title: string
  external?: boolean
  image?: { src: string; alt: string }
}

type ContentListProps = {
  items: ContentListItem[]
  className?: string
}

function ContentListIcon({ image }: { image: { src: string; alt: string } }) {
  return (
    <img
      src={image.src}
      alt={image.alt}
      width={32}
      height={32}
      className="size-8 shrink-0 rounded-md border border-border/50 object-cover transition-transform duration-200 ease-out [image-rendering:pixelated] group-hover:scale-110 group-hover:rotate-3"
      data-slot="content-list-icon"
    />
  )
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
              className="group flex items-center gap-3 text-sm text-foreground underline-offset-4 hover:underline"
              data-slot="content-list-link"
            >
              {item.image && <ContentListIcon image={item.image} />}
              {item.title}
            </a>
          ) : (
            <span
              className="flex items-center gap-3 text-sm text-foreground"
              data-slot="content-list-item"
            >
              {item.image && <ContentListIcon image={item.image} />}
              {item.title}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}
