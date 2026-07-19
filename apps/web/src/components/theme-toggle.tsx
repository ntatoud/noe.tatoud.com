import { useEffect, useState } from 'react'

import { HugeiconsIcon } from '@hugeicons/react'

import { Button } from '@/components/ui/button'
import { moonIcon, sunIcon } from '@/layout/site-config'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // localStorage unavailable (private mode, disabled storage) — theme just won't persist
  }
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    )
  }, [])

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      aria-label="Toggle theme"
      data-slot="theme-toggle"
      onClick={() => {
        const next = theme === 'dark' ? 'light' : 'dark'
        setTheme(next)
        applyTheme(next)
      }}
    >
      <HugeiconsIcon icon={theme === 'dark' ? sunIcon : moonIcon} size={18} />
    </Button>
  )
}
