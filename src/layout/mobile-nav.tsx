import { Link } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import { nav } from '@/layout/nav-config'
import { cn } from '@/lib/utils'

export function MobileNav() {
  return (
    <nav
      aria-label="Main"
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 sm:hidden',
        'border-t border-border/50',
        'bg-background/80 backdrop-blur-lg',
        'pb-[env(safe-area-inset-bottom)]',
      )}
    >
      <div className="flex flex-row items-center justify-around px-4 pt-2 pb-2">
        {nav.map((item) => (
          <Link
            key={item.to}
            {...item}
            activeProps={{ className: 'text-primary' }}
            className={cn(
              'flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-lg px-3 py-1.5',
              'text-muted-foreground',
              'transition-colors duration-200',
              'hover:text-foreground',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            )}
          >
            <HugeiconsIcon icon={item.icon} size={22} />
            <span className="text-[0.625rem] leading-none font-medium">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
