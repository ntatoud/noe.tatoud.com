/// <reference types="vite/client" />

// Vite's `?inline` query returns the asset as a base64 data URL string.
declare module '*?inline' {
  const dataUrl: string
  export default dataUrl
}

interface ImportMetaEnv {
  /** ISO date of the build, set by `vite.config.ts`: the site's "today". */
  readonly BUILD_DATE: string
}
