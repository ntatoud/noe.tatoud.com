import { Icon } from './icon'
import type { IconProps } from './icon'

export function IconCommandPalette(props: IconProps) {
  return (
    <Icon {...props}>
      {/* outer frame */}
      <rect x={2} y={3} width={20} height={1} />
      <rect x={2} y={4} width={1} height={17} />
      <rect x={21} y={4} width={1} height={17} />
      <rect x={2} y={20} width={20} height={1} />
      {/* search bar */}
      <rect x={4} y={6} width={16} height={1} />
      <rect x={4} y={7} width={1} height={2} />
      <rect x={19} y={7} width={1} height={2} />
      <rect x={4} y={9} width={16} height={1} />
      {/* cursor in search bar */}
      <rect x={6} y={7} width={1} height={2} />
      {/* list items */}
      <rect x={5} y={12} width={14} height={1} />
      <rect x={5} y={15} width={10} height={1} />
      <rect x={5} y={18} width={12} height={1} />
    </Icon>
  )
}
