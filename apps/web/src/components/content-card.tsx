import type { ReactNode } from 'react'

import { Link } from '@tanstack/react-router'

import { ArrowUpRight02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type CardLink =
  | { external: true; href: string }
  | {
      external?: false
      to: '/blog/$slug' | '/projects/$slug' | '/talks/$slug'
      slug: string
    }

type ContentCardProps = {
  slot: string
  link: CardLink
  /** Lift and cast a shadow on hover; the blog card only recolours its border. */
  lift?: boolean
  /** Rendered edge to edge above the padded body, e.g. a hero image. */
  media?: ReactNode
  /** Span the whole grid row and, from `md` up, sit the media beside the body. */
  featured?: boolean
  children: ReactNode
}

/** The linked card shell shared by the blog, project and talk grids. */
export function ContentCard({
  slot,
  link,
  lift = true,
  media,
  featured = false,
  children,
}: ContentCardProps) {
  const className = cn(
    'group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card outline-none hover:border-foreground/20 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
    lift
      ? 'transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20'
      : 'transition-colors',
    featured && 'md:flex-row',
  )
  const bodyClassName = cn(
    'flex flex-1 flex-col gap-2 p-4',
    featured && 'md:justify-center md:gap-3 md:p-8',
  )

  return (
    <li
      className={cn(featured && 'sm:col-span-full')}
      data-slot={slot}
      data-featured={featured || undefined}
    >
      {link.external ? (
        <a
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className={className}
        >
          {media}
          <div className={bodyClassName}>{children}</div>
        </a>
      ) : (
        <Link
          to={link.to}
          params={{ slug: link.slug }}
          preload="intent"
          className={className}
        >
          {media}
          <div className={bodyClassName}>{children}</div>
        </Link>
      )}
    </li>
  )
}

export function CardTitle({
  children,
  external = false,
  className,
}: {
  children: ReactNode
  external?: boolean
  className?: string
}) {
  return (
    <h3
      className={cn(
        'line-clamp-2 min-h-[2lh] font-semibold tracking-tight text-foreground underline-offset-4 group-hover:underline',
        className,
      )}
    >
      {children}
      {external && (
        <HugeiconsIcon
          icon={ArrowUpRight02Icon}
          size={14}
          className="ml-1 inline-block align-text-top text-muted-foreground"
          aria-hidden="true"
        />
      )}
    </h3>
  )
}

export function CardDescription({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        'line-clamp-2 min-h-[2lh] text-sm text-muted-foreground',
        className,
      )}
    >
      {children}
    </p>
  )
}

/** The first three tags. Pinned to the bottom of the card unless told not to. */
export function CardTags({
  tags,
  pinToBottom = true,
}: {
  tags: ReadonlyArray<string> | undefined
  pinToBottom?: boolean
}) {
  return (
    <div
      className={cn(
        'flex min-h-5.5 flex-wrap gap-1 pt-2',
        pinToBottom && 'mt-auto',
      )}
    >
      {tags?.slice(0, 3).map((tag) => (
        <Badge key={tag} variant="outline">
          {tag}
        </Badge>
      ))}
    </div>
  )
}
