import { Icon } from './icon'
import type { IconProps } from './icon'

function IconLost(props: IconProps) {
  return (
    <Icon {...props}>
      {/* compass circle */}
      <rect x={8} y={2} width={8} height={1} />
      <rect x={5} y={3} width={14} height={1} />
      <rect x={4} y={4} width={16} height={1} />
      <rect x={3} y={5} width={18} height={1} />
      <rect x={2} y={6} width={20} height={1} />
      <rect x={2} y={7} width={20} height={1} />
      <rect x={2} y={8} width={20} height={1} />
      <rect x={2} y={9} width={20} height={1} />
      <rect x={2} y={10} width={20} height={1} />
      <rect x={2} y={11} width={20} height={1} />
      <rect x={2} y={12} width={20} height={1} />
      <rect x={2} y={13} width={20} height={1} />
      <rect x={3} y={14} width={18} height={1} />
      <rect x={4} y={15} width={16} height={1} />
      <rect x={5} y={16} width={14} height={1} />
      <rect x={8} y={17} width={8} height={1} />
      {/* needle N-S (dark cutout) */}
      <rect x={11} y={5} width={2} height={4} />
      <rect x={11} y={11} width={2} height={4} />
      {/* needle E-W */}
      <rect x={5} y={9} width={4} height={2} />
      <rect x={15} y={9} width={4} height={2} />
      {/* center dot */}
      <rect x={11} y={9} width={2} height={2} />
    </Icon>
  )
}

export const lost = { id: 'lost' as const, icon: IconLost }
