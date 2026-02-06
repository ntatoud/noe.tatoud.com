import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function CardList({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-8', className)} {...props} />
}

export function Card({ className, ...props }: ComponentProps<'article'>) {
  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-lg border border-border transition-colors hover:bg-muted/50',
        className,
      )}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('block p-6', className)} {...props} />
}

export function CardTitle({ className, ...props }: ComponentProps<'h2'>) {
  return (
    <h2
      className={cn(
        'text-xl font-semibold tracking-tight group-hover:text-primary',
        className,
      )}
      {...props}
    />
  )
}

export function CardDescription({
  className,
  ...props
}: ComponentProps<'p'>) {
  return <p className={cn('mt-2 text-muted-foreground', className)} {...props} />
}

export function CardTags({ tags, className }: { tags: string[]; className?: string }) {
  if (tags.length === 0) return null
  return (
    <div className={cn('mt-3 flex flex-wrap gap-2', className)}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'mt-4 flex items-center gap-2 text-sm text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}
