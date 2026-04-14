import { PixelVolumeHigh, PixelVolumeMute } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { useAchievements } from '@/features/achievements/engine'
import { useSoundMuted } from '@/hooks/use-sound-muted'

export function SoundToggle() {
  const [muted, toggleMuted] = useSoundMuted()
  const { unlock } = useAchievements()

  function handleToggle() {
    toggleMuted()
    // Unlock when turning sound ON (currently muted → will become unmuted)
    if (muted) unlock('audiophile')
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handleToggle}
      aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
    >
      {muted ? <PixelVolumeMute size={16} /> : <PixelVolumeHigh size={16} />}
    </Button>
  )
}
