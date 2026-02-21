import { useEffect, useState } from 'react'
import { SoundToggle } from '@/components/sound-toggle'
import { DesktopNav } from '@/layout/desktop-nav'
import { cn } from '@/lib/utils'

const SCROLL_THRESHOLD = 50

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const scroller = document.body
    function onScroll() {
      setScrolled(scroller.scrollTop > SCROLL_THRESHOLD)
    }
    onScroll()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 z-50 hidden w-full items-center justify-center px-5 pt-[env(safe-area-inset-top)] sm:flex',
        'transition-transform duration-100',
        scrolled && 'pointer-events-none translate-y-2',
      )}
    >
      <div
        className={cn(
          'pointer-events-auto transition-[border,background-color,box-shadow,backdrop-filter] duration-100',
          scrolled &&
            'rounded-md border border-border bg-card shadow-lg backdrop-blur-sm',
        )}
      >
        <DesktopNav />
      </div>
      <div className="pointer-events-auto absolute right-5">
        <SoundToggle />
      </div>
    </header>
  )
}
