import { lazy, Suspense, useState } from 'react'

import type { HotkeySequence } from '@tanstack/hotkeys'
import { useHotkey, useHotkeySequence } from '@tanstack/react-hotkeys'
import { useNavigate } from '@tanstack/react-router'

import { engine } from '@/features/achievements/engine'
import { useSoundMuted } from '@/hooks/use-sound-muted'

const CommandPaletteDialog = lazy(() =>
  import('./command-palette-dialog').then((m) => ({
    default: m.CommandPaletteDialog,
  })),
)

const SEQ_HOME: HotkeySequence = ['G', 'H']
const SEQ_BLOG: HotkeySequence = ['G', 'B']
const SEQ_ACHIEVEMENTS: HotkeySequence = ['G', 'A']

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const [muted, toggleMuted] = useSoundMuted()

  useHotkey('Mod+K', () => {
    setOpen((prev) => {
      if (!prev) engine.unlock('command-palette')
      return !prev
    })
  })

  useHotkeySequence(SEQ_HOME, () => void navigate({ to: '/' }), {
    enabled: !open,
  })
  useHotkeySequence(SEQ_BLOG, () => void navigate({ to: '/blog' }), {
    enabled: !open,
  })
  useHotkeySequence(
    SEQ_ACHIEVEMENTS,
    () => void navigate({ to: '/achievements' }),
    {
      enabled: !open,
    },
  )

  useHotkey('M', () => toggleMuted(), { enabled: !open })

  if (!open) return null

  return (
    <Suspense>
      <CommandPaletteDialog
        search={search}
        onSearchChange={setSearch}
        onClose={() => setOpen(false)}
        muted={muted}
        onToggleMuted={toggleMuted}
      />
    </Suspense>
  )
}
