import type { AchievementId } from '../engine'
import type { AchievementDef as LibAchievementDef } from 'achievements'
import type { IconProps } from './icon'

export type { AchievementId }

export type Achievement = LibAchievementDef<AchievementId>

export type AchievementDef = Achievement & {
  icon: (props: IconProps) => React.ReactElement
}
