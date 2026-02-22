import type { PixelIconProps } from './types'

export function PixelExternalLink({
  size = 16,
  filled: _filled,
  ...props
}: PixelIconProps) {
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
      <path d="M24 0V10H22V4H20V6H18V8H16V10H14V12H12V10H14V8H16V6H18V4H20V2H14V0H24ZM20 12V22H2V4H12V6H4V20H18V12H20Z" />
    </svg>
  )
}
