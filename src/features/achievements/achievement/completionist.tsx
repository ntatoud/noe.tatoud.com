import { Icon } from './icon'
import type { IconProps } from './icon'
import type { AchievementDef } from './types'

function IconCrown(props: IconProps) {
  return (
    <Icon {...props}>
      {/* three crown points */}
      <rect x={4} y={4} width={2} height={2} />
      <rect x={11} y={3} width={2} height={4} />
      <rect x={18} y={4} width={2} height={2} />
      {/* crown body */}
      <rect x={3} y={6} width={18} height={1} />
      <rect x={3} y={7} width={18} height={5} />
      <rect x={3} y={12} width={18} height={1} />
      {/* base */}
      <rect x={2} y={13} width={20} height={4} />
      <rect x={3} y={17} width={18} height={1} />
      {/* jewels */}
      <rect x={6} y={9} width={2} height={2} />
      <rect x={11} y={9} width={2} height={2} />
      <rect x={16} y={9} width={2} height={2} />
    </Icon>
  )
}

export const completionist: AchievementDef = {
  id: 'completionist',
  label: 'Completionist',
  description: 'Read every blog post.',
  hidden: false,
  icon: IconCrown,
}
