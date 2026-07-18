/// <reference types="vite/client" />

// Vite's `?inline` query returns the asset as a base64 data URL string.
declare module '*?inline' {
  const dataUrl: string
  export default dataUrl
}
