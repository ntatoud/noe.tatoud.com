import type { PixelIconProps } from './types'

export function PixelTrophy({ size = 16, filled, ...props }: PixelIconProps) {
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
      {filled ? (
        <path d="M7 3 H17 V4 H21 V7 H18 V8 H17 V9 H16 V10 H15 V11 H14 V12 H13 V16 H16 V17 H17 V18 H7 V17 H8 V16 H11 V12 H10 V11 H9 V10 H8 V9 H7 V8 H6 V7 H3 V4 H7 V3 Z" />
      ) : (
        <path
          d="M7 3 H17 V4 H21 V7 H18 V8 H17 V9 H16 V10 H15 V11 H14 V12 H13 V16 H16 V17 H17 V18 H7 V17 H8 V16 H11 V12 H10 V11 H9 V10 H8 V9 H7 V8 H6 V7 H3 V4 H7 V3 Z M4 5 H20 V6 H4 Z"
          fillRule="evenodd"
        />
      )}
    </svg>
  )
}
