import { Icon } from './icon'
import type { IconProps } from './icon'
import type { AchievementDef } from './types'

function IconNote(props: IconProps) {
  return (
    <Icon {...props}>
      {/* stem */}
      <rect x={14} y={3} width={2} height={14} />
      {/* flag on stem */}
      <rect x={16} y={3} width={4} height={1} />
      <rect x={16} y={4} width={4} height={1} />
      <rect x={16} y={5} width={3} height={1} />
      <rect x={17} y={6} width={2} height={1} />
      {/* note head */}
      <rect x={9} y={14} width={7} height={1} />
      <rect x={8} y={15} width={8} height={1} />
      <rect x={8} y={16} width={8} height={1} />
      <rect x={8} y={17} width={8} height={1} />
      <rect x={9} y={18} width={7} height={1} />
    </Icon>
  )
}

export const audiophile: AchievementDef = {
  id: 'audiophile',
  label: 'Audiophile',
  description: 'Toggled the sound on.',
  hidden: false,
  hint: false,
  icon: IconNote,
}
