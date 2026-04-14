// Augment React's HTMLAttributes with a `tw` attribute used by
// takumi-js/response (Satori) to apply Tailwind classes in OG images.
import 'react'

declare module 'react' {
  interface HTMLAttributes<T> {
    tw?: string
  }
}
