import { useSyncExternalStore } from 'react'

import { HugeiconsIcon } from '@hugeicons/react'

import { Button } from '@/components/ui/button'
import { moonIcon, sunIcon } from '@/layout/site-config'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

// The `dark` class on <html> is the source of truth: the inline script in
// __root.tsx sets it before hydration, so the DOM already holds the theme by
// the time React runs. Reading it through a store keeps the button in sync
// with that external state without a mount effect.
const listeners = new Set<() => void>()

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange)
  return () => {
    listeners.delete(onStoreChange)
  }
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function getServerSnapshot(): Theme {
  return 'dark'
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // localStorage unavailable (private mode, disabled storage) — theme just won't persist
  }
  for (const listener of listeners) listener()
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      aria-label="Toggle theme"
      data-slot="theme-toggle"
      onClick={() => {
        applyTheme(theme === 'dark' ? 'light' : 'dark')
      }}
    >
      <HugeiconsIcon icon={theme === 'dark' ? sunIcon : moonIcon} size={18} />
    </Button>
  )
}
