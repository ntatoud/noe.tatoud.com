import type { PixelIconProps } from './types'

export function PixelSourceCode({
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
      <path d="M7 7V8H6V9H5V10H4V11H3V13H4V14H5V15H6V16H7V17H5V16H4V15H3V14H2V13H1V11H2V10H3V9H4V8H5V7H7Z" />
      <path d="M15 3H16V6H15V9H14V12H13V14H12V17H11V20H10V21H9V18H10V15H11V12H12V10H13V7H14V4H15V3Z" />
      <path d="M23 11V13H22V14H21V15H20V16H19V17H17V16H18V15H19V14H20V13H21V11H20V10H19V9H18V8H17V7H19V8H20V9H21V10H22V11H23Z" />
    </svg>
  )
}
