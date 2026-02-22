import { useEffect, useRef } from 'react'
import { useRouter } from '@tanstack/react-router'
import ClickSpark from '@/components/click-spark'
import { AchievementProvider } from '@/features/achievements/achievement-provider'
import {
  CLICK_FRENZY_TARGET,
  EXPLORER_SECTIONS,
  addVisitedSection,
  getVisitedSections,
  incrementClickCount,
  useAchievements,
  useAchievementsStore,
} from '@/features/achievements/use-achievements'
import { click8bitSound } from '@/lib/click-8bit'
import { getSoundMuted } from '@/hooks/use-sound-muted'
import { playSound } from '@/lib/sound-engine'
import { Footer } from '@/layout/footer'
import { Header } from '@/layout/header'
import { MobileNav } from '@/layout/mobile-nav'

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

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
  const { unlock } = useAchievements()
  const router = useRouter()

  // first-visit / returning
  useEffect(() => {
    const { unlockedIds, actions } = useAchievementsStore.getState()
    if (!unlockedIds.has('first-visit')) {
      actions.unlock('first-visit')
    } else if (!sessionStorage.getItem('returning-fired')) {
      sessionStorage.setItem('returning-fired', '1')
      actions.unlock('returning')
    }
  }, [])

  // night-owl
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 0 && hour < 5) unlock('night-owl')
  }, [unlock])

  // keyboard warrior (Tab) + Konami code
  useEffect(() => {
    let tabTriggered = false
    let konamiProgress = 0
    function handleKeydown(e: KeyboardEvent) {
      if (!tabTriggered && e.key === 'Tab') {
        tabTriggered = true
        unlock('keyboard')
      }
      if (e.key === KONAMI[konamiProgress]) {
        konamiProgress++
        if (konamiProgress === KONAMI.length) {
          unlock('secret')
          konamiProgress = 0
        }
      } else {
        konamiProgress = 0
      }
    }
    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [unlock])

  // click frenzy — 100 clicks
  useEffect(() => {
    function handleClick() {
      const count = incrementClickCount()
      if (count >= CLICK_FRENZY_TARGET) unlock('click-frenzy')
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [unlock])

  // explorer — track visited sections (initial load + navigations)
  useEffect(() => {
    function trackSection(pathname: string) {
      const section = EXPLORER_SECTIONS.find(
        (s) => pathname === s || pathname.startsWith(s + '/'),
      )
      if (!section) return
      addVisitedSection(section)
      if (EXPLORER_SECTIONS.every((s) => getVisitedSections().has(s))) {
        unlock('explorer')
      }
    }

    trackSection(window.location.pathname)

    return router.subscribe('onResolved', () => {
      trackSection(window.location.pathname)
    })
  }, [router, unlock])

  return null
}

function LayoutInner({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLElement>(null)

  return (
    <div className="flex h-dvh flex-1 flex-col sm:h-auto sm:min-h-dvh">
      <ClickSpark className="relative flex flex-1 flex-col">
        <ScrollToTop mainRef={mainRef} />
        <ClickSound />
        <AchievementTriggers />
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

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AchievementProvider>
      <LayoutInner>{children}</LayoutInner>
    </AchievementProvider>
  )
}
