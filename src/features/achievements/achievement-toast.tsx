import { useCallback, useEffect, useState } from 'react'
import { ACHIEVEMENTS } from './achievements'
import { getAchievementIcon } from './achievement-icons'
import type { AchievementId } from './achievements'
import { notificationPopSound } from '@/lib/notification-pop'
import { getSoundMuted } from '@/hooks/use-sound-muted'
import { playSound } from '@/lib/sound-engine'
import { cn } from '@/lib/utils'

const AUTO_DISMISS_MS = 7000
const EXIT_DURATION_MS = 250

export function AchievementToast({
  queue,
  onDismiss,
}: {
  queue: Array<AchievementId>
  onDismiss: (id: AchievementId) => void
}) {
  return (
    <section
      aria-label="Notifications"
      className="fixed bottom-24 left-3 z-60 flex flex-col gap-2 sm:bottom-5"
    >
      <ol aria-live="polite" aria-relevant="additions" className="contents">
        {queue.map((id) => (
          <ToastItem key={id} id={id} onDismiss={onDismiss} />
        ))}
      </ol>
    </section>
  )
}

function ToastItem({
  id,
  onDismiss,
}: {
  id: AchievementId
  onDismiss: (id: AchievementId) => void
}) {
  const achievement = ACHIEVEMENTS.find((a) => a.id === id)
  const [exiting, setExiting] = useState(false)

  const startDismiss = useCallback(() => {
    setExiting(true)
    setTimeout(() => onDismiss(id), EXIT_DURATION_MS)
  }, [id, onDismiss])

  useEffect(() => {
    if (!getSoundMuted()) {
      void playSound(notificationPopSound.dataUri, { volume: 0.3 })
    }
  }, [])

  useEffect(() => {
    let remaining = AUTO_DISMISS_MS
    let start = Date.now()
    let timer: ReturnType<typeof setTimeout>

    function schedule() {
      timer = setTimeout(startDismiss, remaining)
    }

    function onVisibilityChange() {
      if (document.hidden) {
        clearTimeout(timer)
        remaining -= Date.now() - start
      } else {
        start = Date.now()
        schedule()
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    schedule()

    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [startDismiss])

  if (!achievement) return null

  const Icon = getAchievementIcon(id)

  return (
    <li role="status" aria-atomic="true" className="list-none">
      <button
        type="button"
        onClick={startDismiss}
        aria-label={`Achievement unlocked: ${achievement.label}. Dismiss`}
        className={cn(
          'relative flex cursor-pointer items-center gap-4 px-4 py-3 text-left clip-pixel-lg',
          'bg-border [filter:drop-shadow(2px_2px_0_var(--shelf-card))]',
          'before:pointer-events-none before:absolute before:inset-[2px] before:z-[-1] before:bg-card before:content-[""] before:clip-pixel-lg',
          !exiting && 'animate-in duration-200 fade-in slide-in-from-left-4',
          exiting &&
            'animate-out fill-mode-forwards fade-out slide-out-to-left-4',
        )}
        style={
          exiting ? { animationDuration: `${EXIT_DURATION_MS}ms` } : undefined
        }
      >
        <Icon size={28} className="shrink-0 text-primary" aria-hidden="true" />
        <div>
          <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            Achievement unlocked
          </div>
          <div className="font-mono text-base font-medium text-foreground">
            {achievement.label}
          </div>
        </div>
      </button>
    </li>
  )
}
