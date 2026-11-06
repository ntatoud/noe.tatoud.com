import { useSyncExternalStore } from 'react'

import { Moon02Icon, Sun01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Button } from '@/components/ui/button'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

// The `dark` class on <html> is the source of truth (set before hydration by __root.tsx).
const listeners = new Set<() => void>()

function storedTheme(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange)
  const prefersLight = matchMedia('(prefers-color-scheme: light)')
  const followSystem = () => {
    if (storedTheme()) return
    document.documentElement.classList.toggle('dark', !prefersLight.matches)
    onStoreChange()
  }
  prefersLight.addEventListener('change', followSystem)
  return () => {
    listeners.delete(onStoreChange)
    prefersLight.removeEventListener('change', followSystem)
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
    // localStorage unavailable (private mode, disabled storage): the theme just won't persist.
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
      aria-label={
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      }
      data-slot="theme-toggle"
      onClick={() => {
        applyTheme(theme === 'dark' ? 'light' : 'dark')
      }}
    >
      <HugeiconsIcon
        icon={theme === 'dark' ? Sun01Icon : Moon02Icon}
        size={18}
      />
    </Button>
  )
}
