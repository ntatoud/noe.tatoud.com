import { cn } from '@/lib/utils'
import { NavLink, nav, navGlassStyles } from '@/layout/nav-config'

export function MobileNav() {
  return (
    <nav
      aria-label="Main"
      className={cn(
        'fixed inset-x-0 bottom-4 z-50 flex justify-center sm:hidden',
        'pb-[env(safe-area-inset-bottom)]',
      )}
    >
      <div
        className={cn(
          'flex flex-row items-center gap-2 rounded-lg border border-border/50 px-3 py-1.5',
          navGlassStyles,
        )}
      >
        {nav.map((item) => (
          <NavLink key={item.to} variant="mobile" {...item} />
        ))}
      </div>
    </nav>
  )
}
