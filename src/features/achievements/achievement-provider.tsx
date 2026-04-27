import { ClientOnly } from '@/components/client-only'

import { AchievementToast } from './achievement-toast'
import { Provider, useAchievementToast } from './engine'

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
      <ClientOnly>
        <Toasts />
      </ClientOnly>
    </Provider>
  )
}
