import { useEffect, useRef } from 'react'

import { useRouter } from '@tanstack/react-router'

import ClickSpark from '@/components/click-spark'
import { ClientOnly } from '@/components/client-only'
import { PageLoader } from '@/components/page-loader'
import { SoundToggle } from '@/components/sound-toggle'
import { AchievementProvider } from '@/features/achievements/achievement-provider'
import { useClickFrenzyAchievement } from '@/features/achievements/achievement/click-frenzy'
import { useExplorerAchievement } from '@/features/achievements/achievement/explorer'
import { useFirstVisitAchievement } from '@/features/achievements/achievement/first-visit'
import { useKeyboardAchievement } from '@/features/achievements/achievement/keyboard'
import { useNightOwlAchievement } from '@/features/achievements/achievement/night-owl'
import { useReturningAchievement } from '@/features/achievements/achievement/returning'
import { useSecretAchievement } from '@/features/achievements/achievement/secret'
import { getSoundMuted } from '@/hooks/use-sound-muted'
import { CommandPalette } from '@/layout/command-palette'
import { Footer } from '@/layout/footer'
import { Header } from '@/layout/header'
import { MobileNav } from '@/layout/mobile-nav'
import { click8bitSound } from '@/lib/click-8bit'
import { playSound } from '@/lib/sound-engine'

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

function AchievementTriggers() {
  useFirstVisitAchievement()
  useReturningAchievement()
  useNightOwlAchievement()
  useKeyboardAchievement()
  useSecretAchievement()
  useClickFrenzyAchievement()
  useExplorerAchievement()
  return null
}

function LayoutInner({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLElement>(null)

  return (
    <div className="flex h-dvh flex-1 flex-col sm:h-auto sm:min-h-dvh">
      <ClickSpark className="relative flex flex-1 flex-col">
        <PageLoader />
        <ScrollToTop mainRef={mainRef} />
        <ClickSound />
        <AchievementTriggers />
        <ClientOnly>
          <CommandPalette />
        </ClientOnly>
        <Header />
        <main
          ref={mainRef}
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto pb-[calc(5rem+var(--spacing-safe-bottom))] sm:overflow-visible sm:pb-0"
        >
          {children}
          <Footer />
        </main>
        <MobileNav />
        <div className="fixed top-3 right-3 z-50 pt-safe-top sm:hidden">
          <SoundToggle />
        </div>
      </ClickSpark>
    </div>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AchievementProvider>
      <LayoutInner>{children}</LayoutInner>
    </AchievementProvider>
  )
}
