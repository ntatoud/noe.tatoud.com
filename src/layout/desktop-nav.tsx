import { Link } from '@tanstack/react-router'
import { nav } from '@/layout/nav-config'

export function DesktopNav() {
  return (
    <nav className="flex max-w-3xl flex-row justify-around gap-4 p-4">
      {nav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="flex flex-row justify-center gap-2"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
