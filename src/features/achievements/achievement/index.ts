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
import type { AchievementDef, AchievementId } from './types'

export type { Achievement, AchievementDef, AchievementId } from './types'

const ALL: Array<AchievementDef> = [
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
]

export const ACHIEVEMENTS: Array<AchievementDef> = ALL

const ICON_MAP = Object.fromEntries(ALL.map((a) => [a.id, a.icon])) as Record<
  AchievementId,
  AchievementDef['icon']
>

export function getAchievementIcon(id: AchievementId) {
  return ICON_MAP[id]
}
