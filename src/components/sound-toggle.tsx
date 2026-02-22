import { PixelVolumeHigh, PixelVolumeMute } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { useSoundMuted } from '@/hooks/use-sound-muted'

export function SoundToggle() {
  const [muted, toggleMuted] = useSoundMuted()

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleMuted}
      aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
    >
      {muted ? <PixelVolumeMute size={16} /> : <PixelVolumeHigh size={16} />}
    </Button>
  )
}
