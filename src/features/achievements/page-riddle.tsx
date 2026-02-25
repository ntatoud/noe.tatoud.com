import { useOptimistic, useRef, useState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import { checkAnswer } from './check-riddle'
import {
  RIDDLE_COUNT,
  addSolvedRiddle,
  getSolvedRiddles,
} from './achievement/riddle'
import { useAchievementsStore } from './use-achievements'
import { PixelProgress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useHydrated } from '@/hooks/use-hydrated'
import { getSoundMuted } from '@/hooks/use-sound-muted'
import { notificationPopSound } from '@/lib/notification-pop'
import { playSound } from '@/lib/sound-engine'
import { Hero, HeroSubtitle, HeroTitle } from '@/layout/hero'
import { Section, SectionContent } from '@/layout/section'

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const TOAST_DURATION_MS = 4000

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={disabled || pending}>
      {pending ? '…' : 'Submit'}
    </Button>
  )
}

export function PageRiddle({ riddle, day }: { riddle: string; day: number }) {
  const hydrated = useHydrated()

  const alreadySolved = hydrated && getSolvedRiddles().has(day)
  const solvedCount = hydrated ? getSolvedRiddles().size : 0

  const [guess, setGuess] = useState('')
  const [status, setStatus] = useState<'idle' | 'wrong' | 'correct'>(
    alreadySolved ? 'correct' : 'idle',
  )
  const [isPending, startTransition] = useTransition()
  const [optimisticSolvedCount, setOptimisticSolvedCount] =
    useOptimistic(solvedCount)
  const [progressToast, setProgressToast] = useState<number | null>(null)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function showProgressToast(solved: number) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setProgressToast(solved)
    toastTimerRef.current = setTimeout(
      () => setProgressToast(null),
      TOAST_DURATION_MS,
    )
  }

  function formAction() {
    if (status === 'correct' || !guess.trim()) return

    startTransition(async () => {
      if (!getSolvedRiddles().has(day)) {
        setOptimisticSolvedCount(solvedCount + 1)
      }
      const { correct } = await checkAnswer({ data: guess })

      if (correct) {
        const wasAlreadySolved = getSolvedRiddles().has(day)
        const newSolved = addSolvedRiddle(day)
        if (!wasAlreadySolved) {
          if (!getSoundMuted()) {
            void playSound(notificationPopSound.dataUri, { volume: 0.5 })
          }
          if (newSolved.size >= RIDDLE_COUNT) {
            useAchievementsStore.getState().actions.unlock('riddle')
          } else {
            showProgressToast(newSolved.size)
          }
        }
        setStatus('correct')
      } else {
        setGuess('')
        setStatus('wrong')
      }
    })
  }

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/shrine.png')] bg-cover bg-center opacity-30 grayscale"
        aria-hidden="true"
      />
      <Hero className="pb-12">
        <HeroTitle>The Shrine</HeroTitle>
        <HeroSubtitle>A new riddle awaits each day.</HeroSubtitle>
      </Hero>
      <Section>
        <SectionContent className="items-center gap-8">
          <div className="w-full max-w-lg space-y-8">
            <div className="border-2 border-border p-6">
              <p className="mb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                {DAY_NAMES[day]}'s riddle
              </p>
              <p className="font-head text-lg leading-relaxed">{riddle}</p>
            </div>

            {status === 'correct' ? (
              <p className="font-mono text-sm text-primary">
                {alreadySolved
                  ? '✓ Already solved today — come back tomorrow.'
                  : '✓ Correct.'}
              </p>
            ) : (
              <form action={formAction} className="flex gap-2">
                <Input
                  placeholder="Your answer…"
                  value={guess}
                  onChange={(e) => {
                    setGuess(e.target.value)
                    if (status === 'wrong') setStatus('idle')
                  }}
                  aria-invalid={status === 'wrong'}
                  autoComplete="off"
                  autoFocus
                  className="clip-pixel"
                />
                <SubmitButton disabled={!guess.trim()} />
              </form>
            )}

            {status === 'wrong' && (
              <p className="-mt-6 font-mono text-xs text-destructive">
                Not quite. Try again.
              </p>
            )}

            <PixelProgress
              value={optimisticSolvedCount}
              max={RIDDLE_COUNT}
              label={`${optimisticSolvedCount} / ${RIDDLE_COUNT} days`}
              className="w-full"
            />
          </div>
        </SectionContent>
      </Section>

      {progressToast !== null && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 left-3 z-60 sm:bottom-5"
        >
          <div
            className={cn(
              'relative flex cursor-default items-center gap-4 px-4 py-3 clip-pixel-lg',
              'bg-border [filter:drop-shadow(2px_2px_0_var(--shelf-card))]',
              'before:pointer-events-none before:absolute before:inset-[2px] before:z-[-1] before:bg-card before:content-[""] before:clip-pixel-lg',
              'animate-in duration-200 fade-in slide-in-from-left-4',
            )}
          >
            <div>
              <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                Riddlemaster progress
              </div>
              <div className="font-mono text-base font-medium text-foreground">
                {progressToast} / {RIDDLE_COUNT} days
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
