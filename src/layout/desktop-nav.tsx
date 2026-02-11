import { NavLink, nav } from '@/layout/nav-config'

export function DesktopNav() {
  return (
    <nav aria-label="Main" className="flex flex-row items-center gap-1 p-2">
      {nav.map((item) => (
        <NavLink key={item.to} {...item} />
      ))}
    </nav>
  )
}
