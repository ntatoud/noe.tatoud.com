import { Link } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import { nav } from '@/layout/nav-config'
import { cn } from '@/lib/utils'

export function DesktopNav() {
  return (
    <nav aria-label="Main" className="flex flex-row items-center gap-1 p-2">
      {nav.map((item) => (
        <Link
          key={item.to}
          {...item}
          activeProps={{ className: 'text-primary' }}
          className={cn(
            'group relative flex flex-row items-center gap-2 rounded-lg px-3 py-2',
            'text-sm font-medium text-muted-foreground',
            'transition-colors duration-200',
            'hover:text-foreground',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          )}
        >
          <HugeiconsIcon icon={item.icon} size={18} />
          {item.label}
          <span
            className={cn(
              'absolute -bottom-0.5 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-primary',
              'transition-all duration-200',
              'group-hover:w-5',
              'group-data-[status=active]:w-5',
            )}
          />
        </Link>
      ))}
    </nav>
  )
}
