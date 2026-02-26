import { firstVisit } from './first-visit'
import { returning } from './returning'
import { nightOwl } from './night-owl'
import { audiophile } from './audiophile'
import { explorer } from './explorer'
import { reader } from './reader'
import { completionist } from './completionist'
import { pixelClicker } from './pixel-clicker'
import { social } from './social'
import { keyboard } from './keyboard'
import { secret } from './secret'
import { clickFrenzy } from './click-frenzy'
import { lost } from './lost'
import { riddle } from './riddle'
import { definitions } from '../engine'
import type { AchievementDef, AchievementId } from './types'

export type { Achievement, AchievementDef, AchievementId } from './types'

const icons = [
  firstVisit,
  returning,
  nightOwl,
  audiophile,
  explorer,
  reader,
  completionist,
  pixelClicker,
  social,
  keyboard,
  secret,
  clickFrenzy,
  lost,
  riddle,
]

const iconMap = Object.fromEntries(icons.map((e) => [e.id, e.icon])) as Record<
  AchievementId,
  AchievementDef['icon']
>

export const ACHIEVEMENTS: Array<AchievementDef> = definitions.map((def) => ({
  ...def,
  icon: iconMap[def.id],
}))

export function getAchievementIcon(id: AchievementId) {
  return iconMap[id]
}
