import { DesktopNav } from '@/layout/desktop-nav'

export function Header() {
  return (
    <header className="hidden w-full items-center justify-center sm:flex">
      <DesktopNav />
    </header>
  )
}
