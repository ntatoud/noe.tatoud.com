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
        'fixed top-0 z-50 hidden w-full items-center justify-center px-5 pt-safe-top sm:flex',
        'transition-transform duration-200',
        scrolled && 'pointer-events-none translate-y-2',
      )}
    >
      <div
        className={cn(
          'pointer-events-auto relative transition-[background-color,filter] duration-200 clip-pixel-lg',
          scrolled
            ? 'bg-border pixel-shadow pixel-shadow-card pixel-shadow-x-4 before:absolute before:inset-[2px] before:-z-10 before:bg-card before:content-[""] before:clip-pixel-lg'
            : 'bg-transparent',
        )}
      >
        <div className="flex items-center">
          <DesktopNav />
          <div className="pr-2">
            <SoundToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
