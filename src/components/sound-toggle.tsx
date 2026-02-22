import { Button } from '@/components/ui/button'
import { PixelVolumeHigh, PixelVolumeMute } from '@/components/icons'
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
      {muted ? <PixelVolumeMute size={20} /> : <PixelVolumeHigh size={20} />}
    </Button>
  )
}
