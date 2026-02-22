import { useEffect } from 'react'
import {
  CLICK_FRENZY_TARGET,
  incrementClickCount,
  useAchievementsStore,
} from '../use-achievements'
import { Icon } from './icon'
import type { IconProps } from './icon'
import type { AchievementDef } from './types'

function IconClickFrenzy(props: IconProps) {
  return (
    <Icon {...props}>
      {/* index finger */}
      <rect x={11} y={2} width={2} height={8} />
      {/* middle finger */}
      <rect x={14} y={4} width={2} height={6} />
      {/* ring finger */}
      <rect x={17} y={5} width={2} height={5} />
      {/* thumb */}
      <rect x={7} y={9} width={4} height={2} />
      {/* palm */}
      <rect x={9} y={10} width={10} height={4} />
      <rect x={9} y={14} width={8} height={3} />
      {/* wrist */}
      <rect x={10} y={17} width={6} height={3} />
      {/* click lines */}
      <rect x={3} y={3} width={3} height={1} />
      <rect x={4} y={6} width={2} height={1} />
      <rect x={2} y={9} width={3} height={1} />
    </Icon>
  )
}

export const clickFrenzy: AchievementDef = {
  id: 'click-frenzy',
  label: 'Click Frenzy',
  description: 'Clicked 100 times on the site.',
  hidden: false,
  icon: IconClickFrenzy,
}

export function useClickFrenzyAchievement() {
  useEffect(() => {
    function onDocumentClick() {
      const count = incrementClickCount()
      if (count >= CLICK_FRENZY_TARGET)
        useAchievementsStore.getState().actions.unlock('click-frenzy')
    }
    document.addEventListener('click', onDocumentClick)
    return () => document.removeEventListener('click', onDocumentClick)
  }, [])
}
