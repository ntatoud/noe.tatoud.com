import { Provider, useAchievementToast } from './engine'
import { AchievementToast } from './achievement-toast'

function Toasts() {
  const { queue, dismiss } = useAchievementToast()
  return <AchievementToast queue={queue} onDismiss={dismiss} />
}

export function AchievementProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Provider>
      {children}
      <Toasts />
    </Provider>
  )
}
