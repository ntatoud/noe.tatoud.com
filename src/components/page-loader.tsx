import { useEffect, useState } from 'react'

import { useRouterState } from '@tanstack/react-router'

import { cn } from '@/lib/utils'

type Phase = 'idle' | 'loading' | 'completing'

// Only show the bar if navigation takes longer than this threshold.
// Cache hits typically resolve in <100ms so the bar never appears.
const SHOW_DELAY_MS = 150

export function PageLoader() {
  const isLoading = useRouterState({ select: (s) => s.isLoading })
  const [phase, setPhase] = useState<Phase>('idle')

  useEffect(() => {
    if (isLoading) {
      const t = setTimeout(() => setPhase('loading'), SHOW_DELAY_MS)
      return () => clearTimeout(t)
    } else {
      setPhase((prev) => (prev === 'loading' ? 'completing' : 'idle'))
    }
  }, [isLoading])

  // After completing animation finishes, go back to idle
  useEffect(() => {
    if (phase !== 'completing') return
    const t = setTimeout(() => setPhase('idle'), 400)
    return () => clearTimeout(t)
  }, [phase])

  if (phase === 'idle') return null

  return (
    <div
      role="progressbar"
      aria-label="Page loading"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5"
    >
      <div
        className={cn(
          'h-full w-full origin-left bg-foreground',
          phase === 'loading' && 'animate-page-loading',
          phase === 'completing' &&
            'scale-x-100 transition-transform duration-300',
        )}
      />
    </div>
  )
}
