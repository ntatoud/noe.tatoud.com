import { AchievementToast } from './achievement-toast'
import { useAchievementsStore } from './use-achievements'

export function AchievementProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const toastQueue = useAchievementsStore((s) => s.toastQueue)
  const dismissToast = useAchievementsStore((s) => s.actions.dismissToast)

  return (
    <>
      {children}
      <AchievementToast queue={toastQueue} onDismiss={dismissToast} />
    </>
  )
}
