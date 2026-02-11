import { VolumeHighIcon, VolumeMute02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { useSoundMuted } from '@/hooks/use-sound-muted'

export function SoundToggle() {
  const [muted, toggleMuted] = useSoundMuted()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleMuted}
      aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
    >
      <HugeiconsIcon
        icon={muted ? VolumeMute02Icon : VolumeHighIcon}
        size={20}
      />
    </Button>
  )
}
