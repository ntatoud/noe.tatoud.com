import { useOptimistic, useState, useTransition } from 'react'
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
import { Hero, HeroSubtitle, HeroTitle } from '@/layout/hero'
import { Section, SectionContent } from '@/layout/section'
import { Route } from '@/routes/shrine'

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={disabled || pending}>
      {pending ? '…' : 'Submit'}
    </Button>
  )
}

export function PageRiddle() {
  const { riddle, day } = Route.useLoaderData()
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

  function formAction() {
    if (status === 'correct' || !guess.trim()) return

    startTransition(async () => {
      setOptimisticSolvedCount(solvedCount + 1)
      const { correct } = await checkAnswer({ data: guess })

      if (correct) {
        const newSolved = addSolvedRiddle(day)
        if (newSolved.size >= RIDDLE_COUNT) {
          useAchievementsStore.getState().actions.unlock('riddle')
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
              className={cn(
                'w-full transition-opacity',
                isPending && 'opacity-50',
              )}
            />
          </div>
        </SectionContent>
      </Section>
    </div>
  )
}
