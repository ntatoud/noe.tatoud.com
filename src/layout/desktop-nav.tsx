import { Link, useMatchRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { nav } from '@/layout/nav-config'

export function DesktopNav() {
  return (
    <nav aria-label="Main" className="flex flex-row items-center gap-0 p-2">
      {nav.map((item) => (
        <NavButton key={item.to} item={item} />
      ))}
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
      size="sm"
      nativeButton={false}
      className="text-muted-foreground hover:text-foreground data-[status=active]:bg-muted data-[status=active]:text-foreground"
      render={<Link {...linkProps} />}
    >
      <Icon size={16} filled={isActive} />
      {item.label}
    </Button>
  )
}
