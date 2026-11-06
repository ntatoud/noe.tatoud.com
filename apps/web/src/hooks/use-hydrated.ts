import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

// False on the server and during hydration, so prerendered markup and the first client render agree.
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
