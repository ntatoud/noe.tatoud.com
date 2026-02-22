import type { IconProps } from './icon'

export type AchievementId =
  | 'first-visit'
  | 'returning'
  | 'night-owl'
  | 'audiophile'
  | 'explorer'
  | 'reader'
  | 'completionist'
  | 'pixel-clicker'
  | 'social'
  | 'keyboard'
  | 'secret'
  | 'click-frenzy'
  | 'lost'

export type Achievement = {
  id: AchievementId
  label: string
  description: string
  hidden: boolean
}

export type AchievementDef = Achievement & {
  icon: (props: IconProps) => React.ReactElement
}
