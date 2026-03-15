import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'sound-muted'
const SYNC_EVENT = 'sound-muted-changed'
let _muted: boolean | null = null

function readMuted(): boolean {
  if (_muted !== null) return _muted
  if (typeof window === 'undefined') return false
  try {
    _muted = localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    _muted = false
  }
  return _muted
}

export function getSoundMuted(): boolean {
  return readMuted()
}

export function useSoundMuted() {
  const [muted, setMutedState] = useState(false)

  useEffect(() => {
    setMutedState(readMuted())

    function handleSync() {
      setMutedState(readMuted())
    }
    window.addEventListener(SYNC_EVENT, handleSync)
    return () => window.removeEventListener(SYNC_EVENT, handleSync)
  }, [])

  const toggleMuted = useCallback(() => {
    const next = !readMuted()
    _muted = next
    try {
      localStorage.setItem(STORAGE_KEY, String(next))
    } catch {
      // storage unavailable
    }
    setMutedState(next)
    window.dispatchEvent(new Event(SYNC_EVENT))
  }, [])

  return [muted, toggleMuted] as const
}
