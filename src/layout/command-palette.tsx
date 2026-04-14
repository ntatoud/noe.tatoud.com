import { useState } from 'react'

import type { HotkeySequence } from '@tanstack/hotkeys'
import { useHotkey, useHotkeySequence } from '@tanstack/react-hotkeys'
import { useNavigate } from '@tanstack/react-router'

import { createPortal } from 'react-dom'

import { PixelVolumeHigh, PixelVolumeMute } from '@/components/icons'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { engine } from '@/features/achievements/engine'
import { useSoundMuted } from '@/hooks/use-sound-muted'
import { nav } from '@/layout/nav-config'

const NAV_SHORTCUTS: Record<string, string> = {
  '/': 'G H',
  '/blog': 'G B',
  '/achievements': 'G A',
}

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

  // Navigation sequences (disabled when palette is open)
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

  // Toggle mute (disabled when palette is open)
  useHotkey('M', () => toggleMuted(), { enabled: !open })

  function handleSelect(to: string) {
    setOpen(false)
    void navigate({ to })
  }

  if (!open) return null

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60"
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="fixed top-[30%] left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2"
      >
        <Command className="relative bg-border pixel-shadow clip-pixel-lg pixel-shadow-card pixel-shadow-x-4 before:pointer-events-none before:absolute before:inset-[2px] before:z-[-1] before:bg-background before:content-[''] before:clip-pixel-lg">
          <CommandInput
            autoFocus
            placeholder="Type a command..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {search.toLowerCase() !== '/riddle' && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
            <CommandGroup heading="Navigation">
              {nav.map((item) => (
                <CommandItem
                  key={item.to}
                  value={item.label}
                  onSelect={() => handleSelect(item.to)}
                >
                  <item.icon className="size-4" />
                  {item.label}
                  {NAV_SHORTCUTS[item.to] && (
                    <CommandShortcut>{NAV_SHORTCUTS[item.to]}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Commands">
              <CommandItem
                value="Toggle sound"
                onSelect={() => {
                  toggleMuted()
                  setOpen(false)
                }}
              >
                {muted ? (
                  <PixelVolumeMute className="size-4" />
                ) : (
                  <PixelVolumeHigh className="size-4" />
                )}
                {muted ? 'Turn sound on' : 'Turn sound off'}
                <CommandShortcut>M</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            {search.toLowerCase() === '/riddle' && (
              <CommandGroup heading="???" forceMount>
                <CommandItem
                  value="/riddle"
                  forceMount
                  onSelect={() => handleSelect('/shrine')}
                >
                  Enter the shrine
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </div>
    </>,
    document.body,
  )
}
