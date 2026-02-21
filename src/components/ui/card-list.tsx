import type { ComponentProps } from 'react'
import { Badge } from '@/components/ui/badge'
import { Image } from '@/components/ui/image'
import { cn } from '@/lib/utils'

export function CardList({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2', className)}
      {...props}
    />
  )
}

export function Card({ className, ...props }: ComponentProps<'article'>) {
  return (
    <article
      className={cn(
        'group relative rounded-xl border border-border ring-1 ring-foreground/15',
        'shadow-[0_4px_0_0_var(--shelf-card)]',
        'has-[>a]:transition-all has-[>a]:duration-200',
        'has-[>a]:hover:-translate-y-[2px] has-[>a]:hover:border-primary/30 has-[>a]:hover:border-b-primary has-[>a]:hover:shadow-[0_6px_0_0_var(--shelf-card)]',
        'has-[>a]:focus-within:-translate-y-[2px] has-[>a]:focus-within:border-primary/30 has-[>a]:focus-within:border-b-primary has-[>a]:focus-within:shadow-[0_6px_0_0_var(--shelf-card)]',
        'has-[>a]:active:translate-y-[2px] has-[>a]:active:shadow-[0_2px_0_0_var(--shelf-card)]',
        className,
      )}
      {...props}
    />
  )
}

export function CardImage({
  src,
  alt = '',
  className,
  priority = false,
}: {
  src: string
  alt?: string
  className?: string
  priority?: boolean
}) {
  return (
    <div className={cn('absolute inset-0 -z-10', className)}>
      <Image
        src={src}
        alt={alt}
        className="size-full object-cover"
        sizes="(max-width: 640px) 100vw, 50vw"
        priority={priority}
      />
      <div className="absolute inset-0 bg-linear-to-t from-card via-card/90 to-card/40" />
    </div>
  )
}

export function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('relative flex h-full flex-col p-6', className)}
      {...props}
    />
  )
}

export function CardTitle({ className, ...props }: ComponentProps<'h2'>) {
  return (
    <h2
      className={cn('font-head text-xl font-semibold text-balance', className)}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      className={cn('mt-2 text-pretty text-muted-foreground', className)}
      {...props}
    />
  )
}

export function CardTags({
  tags,
  className,
}: {
  tags: Array<string>
  className?: string
}) {
  if (tags.length === 0) return null
  return (
    <div className={cn('mt-3 flex flex-wrap gap-2', className)}>
      {tags.map((tag) => (
        <Badge key={tag} variant="outline">
          {tag}
        </Badge>
      ))}
    </div>
  )
}

export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'mt-auto flex items-center gap-2 pt-4 text-sm text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}
