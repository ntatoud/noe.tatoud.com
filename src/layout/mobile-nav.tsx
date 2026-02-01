import { Link } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import { nav } from '@/layout/nav-config'

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 container flex flex-row justify-around border-t border-t-input bg-background p-4 sm:hidden">
      {nav.map((item) => (
        <Link key={item.to} to={item.to}>
          {item.label}
          <HugeiconsIcon icon={item.icon} />
        </Link>
      ))}
    </nav>
  )
}
