import type { PixelIconProps } from './types'

export function PixelLock({ size = 16, ...props }: PixelIconProps) {
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
      <path
        fillRule="evenodd"
        d="M8 4 H16 V3 H8 V4 Z M7 5 H8 V4 H7 V5 Z M6 9 H7 V5 H6 V9 Z M17 5 H16 V4 H17 V5 Z M18 9 H17 V5 H18 V9 Z M4 10 H20 V9 H4 V10 Z M3 20 H21 V10 H3 V20 Z M13 14 H14 V13 H10 V14 H11 V16 H13 V14 Z"
      />
    </svg>
  )
}
