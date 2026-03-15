import { useHydrated } from '@/hooks/use-hydrated'

export function ClientOnly({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated()
  if (!hydrated) return null
  return children
}
