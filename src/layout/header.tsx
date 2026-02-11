import { useEffect, useState } from 'react'
import { SoundToggle } from '@/components/sound-toggle'
import { DesktopNav } from '@/layout/desktop-nav'
import { navGlassStyles } from '@/layout/nav-config'
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
        'fixed top-2 z-50 hidden w-full items-center justify-center px-5 sm:flex',
        'transition-all duration-100 ease-out',
        scrolled && 'pointer-events-none',
      )}
    >
      <div
        className={cn(
          'pointer-events-auto transition-all duration-100 ease-out',
          scrolled && cn(navGlassStyles, 'rounded-lg border border-border/50'),
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
