import type { PixelIconProps } from './types'

export function PixelSpeaker({ size = 16, filled, ...props }: PixelIconProps) {
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
        <g>
          <path d="m20 6v6h-1v1h-1v1h-2v1h-6v-3h3v1h4v-1h1v-1h1v-4h-1v-2h-1v-1h-1v-1h-1v-1h-6v1h-1v1h-1v1h-1v2h-1v4h-1v-1h-1v-3h1v-1h1v-2h1v-1h1v-1h1v-1h8v1h1v1h1v1h1v2z" />
          <path d="m18 8v2h-1v1h-1v1h-2v-1h-5v3h-1v-1h-1v-1h-1v-4h1v-2h1v-1h1v-1h6v1h1v1h1v2z" />
          <path d="m22 19v3h-1v1h-18v-1h-1v-3h1v-1h1v-1h1v-1h4v1h6v-1h4v1h1v1h1v1z" />
        </g>
      ) : (
        <g>
          <path d="m10 7h-1v1h-1v3h1v3h-1v-1h-1v-1h-1v-4h1v-2h1v-1h1v-1h6v1h1v1h1v2h1v2h-1v1h-1v-3h-1v-2h-5z" />
          <path d="m20 6v6h-1v1h-1v1h-2v1h-6v-3h3v1h4v-1h1v-1h1v-4h-1v-2h-1v-1h-1v-1h-1v-1h-6v1h-1v1h-1v1h-1v2h-1v4h-1v-1h-1v-3h1v-1h1v-2h1v-1h1v-1h1v-1h8v1h1v1h1v1h1v2z" />
          <path d="m21 19v-1h-1v-1h-1v-1h-4v1h-6v-1h-4v1h-1v1h-1v1h-1v3h1v1h18v-1h1v-3zm-1 2h-16v-2h1v-1h3v1h8v-1h3v1h1z" />
        </g>
      )}
    </svg>
  )
}
