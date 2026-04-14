import { definitions } from '../engine'
import { IconNote } from './audiophile'
import { IconClickFrenzy } from './click-frenzy'
import { IconCommandPalette } from './command-palette'
import { IconCrown } from './completionist'
import { IconPin } from './explorer'
import { IconFlag } from './first-visit'
import { IconKeyboard } from './keyboard'
import { IconLost } from './lost'
import { IconMoon } from './night-owl'
import { IconCursor } from './pixel-clicker'
import { IconBook } from './reader'
import { IconArrows } from './returning'
import { IconTerminal } from './riddle'
import { IconQuestion } from './secret'
import { IconBubble } from './social'
import type { AchievementDef, AchievementId } from './types'

export type { Achievement, AchievementDef, AchievementId } from './types'

const iconMap: Record<AchievementId, AchievementDef['icon']> = {
  'first-visit': IconFlag,
  returning: IconArrows,
  'night-owl': IconMoon,
  audiophile: IconNote,
  explorer: IconPin,
  reader: IconBook,
  completionist: IconCrown,
  'pixel-clicker': IconCursor,
  social: IconBubble,
  keyboard: IconKeyboard,
  secret: IconQuestion,
  'click-frenzy': IconClickFrenzy,
  lost: IconLost,
  'command-palette': IconCommandPalette,
  riddle: IconTerminal,
}

export const ACHIEVEMENTS: Array<AchievementDef> = definitions.map((def) => ({
  ...def,
  icon: iconMap[def.id],
}))

export function getAchievementIcon(id: AchievementId) {
  return iconMap[id]
}
