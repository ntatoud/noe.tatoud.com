import { getAchievementIcon } from './achievement-icons'
import type { Achievement } from './achievements'
import { PixelLock } from '@/components/icons'
import { PixelProgress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export function AchievementCard({
  achievement,
  unlocked,
  progress,
}: {
  achievement: Achievement
  unlocked: boolean
  progress?: { value: number; max: number; label: string }
}) {
  const isHidden = achievement.hidden && !unlocked
  const Icon = isHidden ? PixelLock : getAchievementIcon(achievement.id)

  return (
    <div
      className={cn(
        'relative flex items-center gap-4 p-4 clip-pixel-lg',
        'before:pointer-events-none before:absolute before:inset-[2px] before:z-[-1] before:content-[""] before:clip-pixel-lg',
        unlocked
          ? 'bg-primary/50 [filter:drop-shadow(2px_2px_0_var(--shelf-primary))] before:bg-card'
          : 'bg-border before:bg-card/60',
      )}
    >
      <div
        className={cn(
          'flex size-10 shrink-0 items-center justify-center',
          unlocked ? 'text-primary' : 'text-muted-foreground/40',
        )}
      >
        <Icon size={24} />
      </div>
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            'font-mono text-sm font-medium tracking-wide',
            unlocked ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          {isHidden ? '???' : achievement.label}
        </div>
        <div className="mt-0.5 font-mono text-xs text-muted-foreground">
          {isHidden
            ? 'Keep exploring to unlock this.'
            : achievement.description}
        </div>
        {!unlocked && progress && (
          <PixelProgress
            value={progress.value}
            max={progress.max}
            label={progress.label}
            className="mt-2"
          />
        )}
      </div>
      {unlocked && (
        <div className="shrink-0 font-mono text-[10px] tracking-widest text-primary uppercase">
          ✓
        </div>
      )}
    </div>
  )
}
