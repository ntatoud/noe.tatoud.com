import { useCallback, useState } from 'react'

import { getMuted, setMuted } from '@/lib/sound'

export function useSoundMuted() {
  const [muted, setMutedState] = useState(() => getMuted())

  const toggleMuted = useCallback(() => {
    const next = !getMuted()
    setMuted(next)
    setMutedState(next)
  }, [])

  return [muted, toggleMuted] as const
}
