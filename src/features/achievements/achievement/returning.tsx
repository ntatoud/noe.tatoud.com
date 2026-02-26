import { useEffect } from 'react'
import { engine } from '../engine'
import { Icon } from './icon'
import type { IconProps } from './icon'

export function IconArrows(props: IconProps) {
  return (
    <Icon {...props}>
      {/* top arrow → */}
      <rect x={3} y={8} width={13} height={2} />
      <rect x={16} y={5} width={1} height={1} />
      <rect x={16} y={6} width={2} height={1} />
      <rect x={16} y={7} width={3} height={1} />
      <rect x={16} y={8} width={2} height={1} />
      <rect x={16} y={9} width={1} height={1} />
      {/* bottom arrow ← */}
      <rect x={8} y={14} width={13} height={2} />
      <rect x={7} y={13} width={1} height={1} />
      <rect x={6} y={14} width={2} height={1} />
      <rect x={5} y={15} width={3} height={1} />
      <rect x={6} y={16} width={2} height={1} />
      <rect x={7} y={17} width={1} height={1} />
    </Icon>
  )
}

export function useReturningAchievement() {
  useEffect(() => {
    if (!engine.isUnlocked('first-visit')) return
    if (sessionStorage.getItem('returning-fired')) return
    sessionStorage.setItem('returning-fired', '1')
    engine.unlock('returning')
  }, [])
}
