import { Icon } from './icon'
import type { IconProps } from './icon'
import type { AchievementDef } from './types'

function IconBubble(props: IconProps) {
  return (
    <Icon {...props}>
      {/* bubble */}
      <rect x={4} y={3} width={16} height={1} />
      <rect x={3} y={4} width={18} height={1} />
      <rect x={3} y={5} width={18} height={1} />
      <rect x={3} y={6} width={18} height={1} />
      <rect x={3} y={7} width={18} height={1} />
      <rect x={3} y={8} width={18} height={1} />
      <rect x={3} y={9} width={18} height={1} />
      <rect x={3} y={10} width={18} height={1} />
      <rect x={3} y={11} width={18} height={1} />
      <rect x={4} y={12} width={16} height={1} />
      {/* tail */}
      <rect x={5} y={13} width={4} height={1} />
      <rect x={5} y={14} width={3} height={1} />
      <rect x={5} y={15} width={2} height={1} />
      <rect x={5} y={16} width={1} height={1} />
      {/* inner lines (text) */}
      <rect x={6} y={6} width={12} height={1} />
      <rect x={6} y={8} width={9} height={1} />
    </Icon>
  )
}

export const social: AchievementDef = {
  id: 'social',
  label: 'Social Butterfly',
  description: 'Clicked a social link.',
  hidden: false,
  icon: IconBubble,
}
