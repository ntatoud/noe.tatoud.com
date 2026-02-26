import { useEffect } from 'react'
import { engine } from '../engine'
import { Icon } from './icon'
import type { IconProps } from './icon'
import type { AchievementDef } from './types'

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

function IconQuestion(props: IconProps) {
  return (
    <Icon {...props}>
      {/* top of question mark */}
      <rect x={8} y={3} width={8} height={1} />
      <rect x={7} y={4} width={10} height={1} />
      <rect x={6} y={5} width={4} height={1} />
      <rect x={14} y={5} width={4} height={1} />
      <rect x={6} y={6} width={3} height={1} />
      <rect x={15} y={6} width={3} height={1} />
      <rect x={14} y={7} width={4} height={1} />
      <rect x={13} y={8} width={4} height={1} />
      <rect x={12} y={9} width={3} height={1} />
      <rect x={11} y={10} width={3} height={1} />
      <rect x={10} y={11} width={4} height={1} />
      <rect x={10} y={12} width={4} height={1} />
      <rect x={10} y={13} width={4} height={1} />
      {/* dot */}
      <rect x={10} y={17} width={4} height={4} />
    </Icon>
  )
}

export const secret: AchievementDef = {
  id: 'secret',
  label: 'Konami',
  description: '↑ ↑ ↓ ↓ ← → ← → B A',
  hidden: true,
  icon: IconQuestion,
}

export function useSecretAchievement() {
  useEffect(() => {
    let progress = 0
    function onKeydown(e: KeyboardEvent) {
      if (e.key === KONAMI[progress]) {
        progress++
        if (progress === KONAMI.length) {
          engine.unlock('secret')
          progress = 0
        }
      } else {
        progress = 0
      }
    }
    document.addEventListener('keydown', onKeydown)
    return () => document.removeEventListener('keydown', onKeydown)
  }, [])
}
