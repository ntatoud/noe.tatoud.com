import { Icon } from './icon'
import type { IconProps } from './icon'

function IconCursor(props: IconProps) {
  return (
    <Icon {...props}>
      {/* cursor arrow */}
      <rect x={3} y={3} width={2} height={16} />
      <rect x={5} y={5} width={2} height={12} />
      <rect x={7} y={7} width={2} height={10} />
      <rect x={9} y={9} width={2} height={7} />
      <rect x={11} y={9} width={2} height={1} />
      <rect x={3} y={3} width={16} height={2} />
      <rect x={3} y={5} width={12} height={2} />
      <rect x={3} y={7} width={10} height={2} />
      <rect x={3} y={9} width={8} height={2} />
      {/* click sparkles */}
      <rect x={14} y={12} width={2} height={1} />
      <rect x={17} y={10} width={1} height={2} />
      <rect x={15} y={15} width={2} height={1} />
      <rect x={18} y={15} width={1} height={2} />
      <rect x={19} y={12} width={2} height={1} />
    </Icon>
  )
}

export const pixelClicker = { id: 'pixel-clicker' as const, icon: IconCursor }
