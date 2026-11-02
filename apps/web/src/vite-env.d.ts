/// <reference types="vite/client" />

declare module '*?inline' {
  const dataUrl: string
  export default dataUrl
}

interface ImportMetaEnv {
  readonly BUILD_DATE: string
}
