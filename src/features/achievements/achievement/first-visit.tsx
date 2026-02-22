import { Icon } from './icon'
import type { IconProps } from './icon'
import type { AchievementDef } from './types'

function IconFlag(props: IconProps) {
  return (
    <Icon {...props}>
      {/* pole */}
      <rect x={10} y={3} width={2} height={19} />
      {/* flag body */}
      <rect x={12} y={3} width={9} height={1} />
      <rect x={12} y={4} width={9} height={1} />
      <rect x={12} y={5} width={9} height={1} />
      <rect x={12} y={6} width={9} height={1} />
      <rect x={12} y={7} width={9} height={1} />
      {/* flag triangle tip */}
      <rect x={12} y={8} width={7} height={1} />
      <rect x={12} y={9} width={5} height={1} />
      <rect x={12} y={10} width={3} height={1} />
      <rect x={12} y={11} width={1} height={1} />
      {/* base */}
      <rect x={6} y={22} width={12} height={1} />
    </Icon>
  )
}

export const firstVisit: AchievementDef = {
  id: 'first-visit',
  label: 'Welcome',
  description: 'Visited the site for the first time.',
  hidden: false,
  hint: false,
  icon: IconFlag,
}
