import { useEffect } from 'react'
import { useAchievementsStore } from '../use-achievements'
import { Icon } from './icon'
import type { IconProps } from './icon'
import type { AchievementDef } from './types'

function IconMoon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x={11} y={3} width={3} height={1} />
      <rect x={9} y={4} width={6} height={1} />
      <rect x={7} y={5} width={6} height={1} />
      <rect x={6} y={6} width={6} height={1} />
      <rect x={5} y={7} width={6} height={1} />
      <rect x={5} y={8} width={5} height={1} />
      <rect x={4} y={9} width={5} height={1} />
      <rect x={4} y={10} width={5} height={1} />
      <rect x={4} y={11} width={5} height={1} />
      <rect x={4} y={12} width={5} height={1} />
      <rect x={4} y={13} width={5} height={1} />
      <rect x={5} y={14} width={5} height={1} />
      <rect x={5} y={15} width={6} height={1} />
      <rect x={6} y={16} width={6} height={1} />
      <rect x={7} y={17} width={6} height={1} />
      <rect x={9} y={18} width={6} height={1} />
      <rect x={11} y={19} width={3} height={1} />
    </Icon>
  )
}

export const nightOwl: AchievementDef = {
  id: 'night-owl',
  label: 'Night Owl',
  description: 'Visited between midnight and 5 AM.',
  hidden: false,
  icon: IconMoon,
}

const FROM = 0
const TO = 5

export function useNightOwlAchievement() {
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const hour =
      Number(
        new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          hour12: false,
          timeZone: tz,
        }).format(new Date()),
      ) % 24 // Intl may return 24 for midnight; normalise to 0
    if (hour >= FROM && hour < TO)
      useAchievementsStore.getState().actions.unlock('night-owl')
  }, [])
}
