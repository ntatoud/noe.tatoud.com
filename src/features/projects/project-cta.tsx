import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ProjectCta({
  title,
  children,
  href,
  buttonLabel,
  buttonIcon,
}: {
  title: string
  children: ReactNode
  href: string
  buttonLabel: string
  buttonIcon?: ReactNode
}) {
  const isMailto = href.startsWith('mailto:')

  return (
    <div
      className={cn(
        'not-prose relative my-8 bg-border clip-pixel-lg',
        '[filter:drop-shadow(4px_4px_0_var(--shelf-card))]',
        'before:pointer-events-none before:absolute before:inset-[2px] before:-z-10 before:bg-card before:content-[""] before:clip-pixel-lg',
      )}
    >
      <div className="flex flex-col items-center gap-4 px-6 py-8 text-center sm:px-10 sm:py-10">
        <p className="font-heading text-xl font-bold tracking-wide uppercase sm:text-2xl">
          {title}
        </p>
        <div className="max-w-md text-sm text-muted-foreground">{children}</div>
        <Button
          nativeButton={false}
          size="lg"
          className="mt-2 h-13 animate-pixel-bounce px-8 text-base"
          render={
            <a
              href={href}
              {...(!isMailto && {
                target: '_blank',
                rel: 'noopener noreferrer',
              })}
            />
          }
        >
          <span className="animate-pixel-blink">{'>'}</span>
          {buttonIcon}
          {buttonLabel}
          <span className="animate-pixel-blink">{'<'}</span>
        </Button>
      </div>
    </div>
  )
}

export function ProjectLinks({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'not-prose relative my-8 bg-border clip-pixel-lg',
        '[filter:drop-shadow(4px_4px_0_var(--shelf-card))]',
        'before:pointer-events-none before:absolute before:inset-[2px] before:-z-10 before:bg-card before:content-[""] before:clip-pixel-lg',
      )}
    >
      <div className="flex flex-col gap-4 px-6 py-8 sm:px-10 sm:py-10">
        <p className="font-heading text-center text-xl font-bold tracking-wide uppercase sm:text-2xl">
          {title}
        </p>
        <div className="flex flex-col gap-1">{children}</div>
      </div>
    </div>
  )
}

export function ProjectInlineLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <Button
      nativeButton={false}
      variant="outline"
      size="lg"
      className="not-prose my-2 flex w-full"
      render={<a href={href} target="_blank" rel="noopener noreferrer" />}
    >
      {children}
    </Button>
  )
}

export function ProjectLinkItem({
  href,
  label,
  description,
}: {
  href: string
  label: string
  description: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group/link flex items-center gap-3 px-4 py-3 clip-pixel',
        'transition-colors duration-75',
        'hover:bg-muted/50',
      )}
    >
      <span className="text-primary transition-transform duration-75 group-hover/link:translate-x-0.5">
        {'>>'}
      </span>
      <span className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
        <span className="font-mono text-sm font-medium text-foreground uppercase">
          {label}
        </span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </span>
    </a>
  )
}
