import { useEffect, useRef } from 'react'
import { useRouter } from '@tanstack/react-router'
import ClickSpark from '@/components/click-spark'
import { click8bitSound } from '@/lib/click-8bit'
import { getSoundMuted } from '@/hooks/use-sound-muted'
import { playSound } from '@/lib/sound-engine'
import { Footer } from '@/layout/footer'
import { Header } from '@/layout/header'
import { MobileNav } from '@/layout/mobile-nav'

function ScrollToTop({
  mainRef,
}: {
  mainRef: React.RefObject<HTMLElement | null>
}) {
  const router = useRouter()
  useEffect(() => {
    return router.subscribe('onResolved', () => {
      mainRef.current?.scrollTo(0, 0)
      document.body.scrollTo(0, 0)
    })
  }, [router, mainRef])
  return null
}

function ClickSound() {
  useEffect(() => {
    function handleClick() {
      if (!getSoundMuted())
        void playSound(click8bitSound.dataUri, { volume: 0.3 })
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])
  return null
}

export function Layout({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLElement>(null)

  return (
    <div className="flex h-dvh flex-1 flex-col sm:h-auto sm:min-h-dvh">
      <ClickSpark className="relative flex flex-1 flex-col">
        <ScrollToTop mainRef={mainRef} />
        <ClickSound />
        <Header />
        <main
          ref={mainRef}
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto pb-[calc(5rem+var(--spacing-safe-bottom))] sm:overflow-visible sm:pb-0"
        >
          {children}
          <Footer />
        </main>
        <MobileNav />
      </ClickSpark>
    </div>
  )
}
