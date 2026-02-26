import { Icon } from './icon'
import type { IconProps } from './icon'

function IconBook(props: IconProps) {
  return (
    <Icon {...props}>
      {/* left page */}
      <rect x={2} y={4} width={9} height={1} />
      <rect x={2} y={5} width={9} height={14} />
      <rect x={2} y={19} width={9} height={1} />
      {/* spine */}
      <rect x={11} y={3} width={2} height={18} />
      {/* right page */}
      <rect x={13} y={4} width={9} height={1} />
      <rect x={13} y={5} width={9} height={14} />
      <rect x={13} y={19} width={9} height={1} />
      {/* left page lines */}
      <rect x={4} y={8} width={5} height={1} />
      <rect x={4} y={10} width={5} height={1} />
      <rect x={4} y={12} width={5} height={1} />
      <rect x={4} y={14} width={5} height={1} />
      {/* right page lines */}
      <rect x={15} y={8} width={5} height={1} />
      <rect x={15} y={10} width={5} height={1} />
      <rect x={15} y={12} width={5} height={1} />
      <rect x={15} y={14} width={5} height={1} />
    </Icon>
  )
}

export const reader = { id: 'reader' as const, icon: IconBook }
