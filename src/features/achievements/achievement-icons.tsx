import type { SVGProps } from 'react'
import type { AchievementId } from './achievements'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Icon({
  size = 16,
  children,
  ...props
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {children}
    </svg>
  )
}

// Flag on a pole — Welcome / first-visit
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

// Two opposing arrows — Returning
function IconArrows(props: IconProps) {
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

// Crescent moon — Night Owl
function IconMoon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x={11} y={3} width={3} height={1} />
      <rect x={9} y={4} width={6} height={1} />
      <rect x={7} y={5} width={6} height={1} />
      <rect x={6} y={6} width={6} height={1} />
      <rect x={5} y={7} width={6} height={1} />
      <rect x={5} y={8} width={5} height={1} />
      <rect x={4} y={9} width={5} height={1} />
      <rect x={4} y={10} width={5} height={1} />
      <rect x={4} y={11} width={5} height={1} />
      <rect x={4} y={12} width={5} height={1} />
      <rect x={4} y={13} width={5} height={1} />
      <rect x={5} y={14} width={5} height={1} />
      <rect x={5} y={15} width={6} height={1} />
      <rect x={6} y={16} width={6} height={1} />
      <rect x={7} y={17} width={6} height={1} />
      <rect x={9} y={18} width={6} height={1} />
      <rect x={11} y={19} width={3} height={1} />
    </Icon>
  )
}

// Musical note — Audiophile
function IconNote(props: IconProps) {
  return (
    <Icon {...props}>
      {/* stem */}
      <rect x={14} y={3} width={2} height={14} />
      {/* flag on stem */}
      <rect x={16} y={3} width={4} height={1} />
      <rect x={16} y={4} width={4} height={1} />
      <rect x={16} y={5} width={3} height={1} />
      <rect x={17} y={6} width={2} height={1} />
      {/* note head */}
      <rect x={9} y={14} width={7} height={1} />
      <rect x={8} y={15} width={8} height={1} />
      <rect x={8} y={16} width={8} height={1} />
      <rect x={8} y={17} width={8} height={1} />
      <rect x={9} y={18} width={7} height={1} />
    </Icon>
  )
}

// Map pin — Explorer
function IconPin(props: IconProps) {
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

// Speech bubble — Social Butterfly
function IconBubble(props: IconProps) {
  return (
    <Icon {...props}>
      {/* bubble */}
      <rect x={4} y={3} width={16} height={1} />
      <rect x={3} y={4} width={18} height={1} />
      <rect x={3} y={5} width={18} height={1} />
      <rect x={3} y={6} width={18} height={1} />
      <rect x={3} y={7} width={18} height={1} />
      <rect x={3} y={8} width={18} height={1} />
      <rect x={3} y={9} width={18} height={1} />
      <rect x={3} y={10} width={18} height={1} />
      <rect x={3} y={11} width={18} height={1} />
      <rect x={4} y={12} width={16} height={1} />
      {/* tail */}
      <rect x={5} y={13} width={4} height={1} />
      <rect x={5} y={14} width={3} height={1} />
      <rect x={5} y={15} width={2} height={1} />
      <rect x={5} y={16} width={1} height={1} />
      {/* inner lines (text) */}
      <rect x={6} y={6} width={12} height={1} />
      <rect x={6} y={8} width={9} height={1} />
    </Icon>
  )
}

// Open book — Reader
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

// Crown — Completionist
function IconCrown(props: IconProps) {
  return (
    <Icon {...props}>
      {/* three crown points */}
      <rect x={4} y={4} width={2} height={2} />
      <rect x={11} y={3} width={2} height={4} />
      <rect x={18} y={4} width={2} height={2} />
      {/* crown body */}
      <rect x={3} y={6} width={18} height={1} />
      <rect x={3} y={7} width={18} height={5} />
      <rect x={3} y={12} width={18} height={1} />
      {/* base */}
      <rect x={2} y={13} width={20} height={4} />
      <rect x={3} y={17} width={18} height={1} />
      {/* jewels */}
      <rect x={6} y={9} width={2} height={2} />
      <rect x={11} y={9} width={2} height={2} />
      <rect x={16} y={9} width={2} height={2} />
    </Icon>
  )
}

// Mouse cursor / crosshair — Pixel Perfect
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

// Keyboard — Keyboard Warrior
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

// Question mark — Secret
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

const ICON_MAP: Record<
  AchievementId,
  (props: IconProps) => React.ReactElement
> = {
  'first-visit': IconFlag,
  returning: IconArrows,
  'night-owl': IconMoon,
  audiophile: IconNote,
  explorer: IconPin,
  social: IconBubble,
  reader: IconBook,
  completionist: IconCrown,
  'pixel-clicker': IconCursor,
  keyboard: IconKeyboard,
  secret: IconQuestion,
}

export function getAchievementIcon(id: AchievementId) {
  return ICON_MAP[id]
}
