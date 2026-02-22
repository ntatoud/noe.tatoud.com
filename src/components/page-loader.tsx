import { useEffect, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

type Phase = 'idle' | 'loading' | 'completing'

export function PageLoader() {
  const isLoading = useRouterState({ select: (s) => s.isLoading })
  const [phase, setPhase] = useState<Phase>('idle')

  // Transition to loading/completing based on router state
  useEffect(() => {
    if (isLoading) {
      setPhase('loading')
    } else {
      setPhase((prev) => (prev === 'loading' ? 'completing' : prev))
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
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px]"
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
