import { definitions } from '../engine'
import { IconFlag } from './first-visit'
import { IconArrows } from './returning'
import { IconMoon } from './night-owl'
import { IconNote } from './audiophile'
import { IconPin } from './explorer'
import { IconBook } from './reader'
import { IconCrown } from './completionist'
import { IconCursor } from './pixel-clicker'
import { IconBubble } from './social'
import { IconKeyboard } from './keyboard'
import { IconQuestion } from './secret'
import { IconClickFrenzy } from './click-frenzy'
import { IconLost } from './lost'
import { IconCommandPalette } from './command-palette'
import { IconTerminal } from './riddle'
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
