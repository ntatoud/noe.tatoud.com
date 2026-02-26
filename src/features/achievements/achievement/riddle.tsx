import { Icon } from './icon'
import type { IconProps } from './icon'

const SOLVED_RIDDLES_KEY = 'solved-riddles'

export const RIDDLE_COUNT = 7

export function getSolvedRiddles(): Set<number> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(SOLVED_RIDDLES_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as Array<number>)
  } catch {
    return new Set()
  }
}

export function addSolvedRiddle(day: number): Set<number> {
  const solved = getSolvedRiddles()
  solved.add(day)
  try {
    localStorage.setItem(SOLVED_RIDDLES_KEY, JSON.stringify([...solved]))
  } catch {
    // storage unavailable
  }
  return solved
}

function IconTerminal(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x={1} y={3} width={22} height={16} />
      <rect x={9} y={19} width={6} height={2} />
      <rect x={6} y={21} width={12} height={1} />
      <rect x={3} y={8} width={1} height={1} />
      <rect x={4} y={9} width={1} height={1} />
      <rect x={3} y={10} width={1} height={1} />
      <rect x={6} y={9} width={4} height={2} />
    </Icon>
  )
}

export const riddle = { id: 'riddle' as const, icon: IconTerminal }
