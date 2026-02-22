import { Icon } from './icon'
import type { IconProps } from './icon'
import type { AchievementDef } from './types'

function IconKeyboard(props: IconProps) {
  return (
    <Icon {...props}>
      {/* keyboard outline */}
      <rect x={1} y={5} width={22} height={1} />
      <rect x={1} y={6} width={1} height={13} />
      <rect x={22} y={6} width={1} height={13} />
      <rect x={1} y={19} width={22} height={1} />
      {/* key rows */}
      <rect x={3} y={8} width={18} height={2} />
      <rect x={3} y={12} width={18} height={2} />
      <rect x={3} y={16} width={18} height={2} />
      {/* key dividers row 1 */}
      <rect x={5} y={8} width={1} height={2} />
      <rect x={8} y={8} width={1} height={2} />
      <rect x={11} y={8} width={1} height={2} />
      <rect x={14} y={8} width={1} height={2} />
      <rect x={17} y={8} width={1} height={2} />
      {/* key dividers row 2 */}
      <rect x={6} y={12} width={1} height={2} />
      <rect x={10} y={12} width={1} height={2} />
      <rect x={14} y={12} width={1} height={2} />
      {/* spacebar */}
      <rect x={7} y={16} width={10} height={2} />
    </Icon>
  )
}

export const keyboard: AchievementDef = {
  id: 'keyboard',
  label: 'Keyboard Warrior',
  description: 'Navigated the site with the keyboard.',
  hidden: true,
  icon: IconKeyboard,
}
