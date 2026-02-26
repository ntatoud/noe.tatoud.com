import { useEffect } from 'react'
import { engine } from '../engine'
import { Icon } from './icon'
import type { IconProps } from './icon'

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

export const firstVisit = { id: 'first-visit' as const, icon: IconFlag }

export function useFirstVisitAchievement() {
  useEffect(() => {
    engine.unlock('first-visit')
  }, [])
}
