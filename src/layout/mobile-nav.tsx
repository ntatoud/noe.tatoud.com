import { Link, useMatchRoute } from '@tanstack/react-router'
import { SoundToggle } from '@/components/sound-toggle'
import { Button } from '@/components/ui/button'
import { nav } from '@/layout/nav-config'
import { cn } from '@/lib/utils'

export function MobileNav() {
  return (
    <nav
      aria-label="Main"
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 sm:hidden',
        'bg-card [filter:drop-shadow(0_-4px_0_var(--shelf-card))]',
        'pb-safe-bottom',
      )}
    >
      <div className="relative flex flex-row items-center justify-around px-4 pt-2 pb-2">
        {nav.map((item) => (
          <NavButton key={item.to} item={item} />
        ))}
        <div className="absolute top-1/2 right-3 -translate-y-1/2">
          <SoundToggle />
        </div>
      </div>
    </nav>
  )
}

function NavButton({ item }: { item: (typeof nav)[number] }) {
  const matchRoute = useMatchRoute()
  const exact = (item as { activeOptions?: { exact?: boolean } }).activeOptions
    ?.exact
  const isActive = !!matchRoute({ to: item.to, fuzzy: !exact })
  const { icon: Icon, ...linkProps } = item

  return (
    <Button
      variant="ghost"
      nativeButton={false}
      className="h-auto min-h-11 min-w-11 flex-col gap-1 px-3 py-1.5 text-muted-foreground hover:text-foreground data-[status=active]:bg-muted data-[status=active]:text-foreground"
      render={<Link {...linkProps} />}
    >
      <Icon size={20} filled={isActive} />
      <span className="font-mono text-[0.55rem] leading-none tracking-widest uppercase">
        {item.label}
      </span>
    </Button>
  )
}
