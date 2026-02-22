import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import ClickSpark from '@/components/click-spark'
import { click8bitSound } from '@/lib/click-8bit'
import { getSoundMuted } from '@/hooks/use-sound-muted'
import { playSound } from '@/lib/sound-engine'
import { Footer } from '@/layout/footer'
import { Header } from '@/layout/header'
import { MobileNav } from '@/layout/mobile-nav'

function ScrollToTop() {
  const router = useRouter()
  useEffect(() => {
    return router.subscribe('onResolved', () => {
      document.body.scrollTo(0, 0)
    })
  }, [router])
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
  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <ClickSpark>
        <ScrollToTop />
        <ClickSound />
        <Header />
        <main className="flex min-w-0 flex-1 flex-col pb-[calc(5rem+var(--spacing-safe-bottom))] sm:pb-0">
          {children}
        </main>
        <Footer />
        <MobileNav />
      </ClickSpark>
    </div>
  )
}
