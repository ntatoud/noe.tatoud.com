import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { engine } from '../engine'
import { Icon } from './icon'
import type { IconProps } from './icon'

const EXPLORER_SECTIONS = ['/', '/blog', '/achievements'] as const

export function IconPin(props: IconProps) {
  return (
    <Icon {...props}>
      {/* pin head (circle) */}
      <rect x={8} y={2} width={8} height={1} />
      <rect x={6} y={3} width={12} height={1} />
      <rect x={5} y={4} width={14} height={1} />
      <rect x={5} y={5} width={14} height={1} />
      <rect x={5} y={6} width={5} height={1} />
      <rect x={14} y={6} width={5} height={1} />
      <rect x={5} y={7} width={4} height={1} />
      <rect x={15} y={7} width={4} height={1} />
      <rect x={5} y={8} width={14} height={1} />
      <rect x={5} y={9} width={14} height={1} />
      <rect x={6} y={10} width={12} height={1} />
      <rect x={8} y={11} width={8} height={1} />
      {/* pin body (triangle) */}
      <rect x={9} y={12} width={6} height={1} />
      <rect x={10} y={13} width={4} height={1} />
      <rect x={10} y={14} width={4} height={1} />
      <rect x={11} y={15} width={2} height={1} />
      <rect x={11} y={16} width={2} height={1} />
      <rect x={11} y={17} width={2} height={1} />
      <rect x={12} y={18} width={1} height={1} />
    </Icon>
  )
}

export function useExplorerAchievement() {
  const router = useRouter()
  useEffect(() => {
    function trackSection(pathname: string) {
      const section = EXPLORER_SECTIONS.find(
        (s) => pathname === s || pathname.startsWith(s + '/'),
      )
      if (!section) return
      engine.collectItem('explorer', section)
    }
    trackSection(window.location.pathname)
    return router.subscribe('onResolved', () => {
      trackSection(window.location.pathname)
    })
  }, [router])
}
