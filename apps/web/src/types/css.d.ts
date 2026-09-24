import 'react'

declare module 'react' {
  // Lets `style` set CSS custom properties, the way dynamic values reach
  // Tailwind classes such as `left-(--at)`.
  interface CSSProperties {
    [property: `--${string}`]: string | number | undefined
  }
}
