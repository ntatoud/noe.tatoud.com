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
import { nav } from '@/layout/nav-config'

const NAV_SHORTCUTS: Record<string, string> = {
  '/': 'G H',
  '/blog': 'G B',
  '/achievements': 'G A',
}

export function CommandPaletteDialog({
  search,
  onSearchChange,
  onClose,
  muted,
  onToggleMuted,
}: {
  search: string
  onSearchChange: (v: string) => void
  onClose: () => void
  muted: boolean
  onToggleMuted: () => void
}) {
  const navigate = useNavigate()

  function handleSelect(to: string) {
    onClose()
    void navigate({ to })
  }

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60"
        onClick={onClose}
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
            onValueChange={onSearchChange}
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
                  onToggleMuted()
                  onClose()
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
