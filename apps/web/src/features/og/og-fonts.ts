import type { OgFont } from '@ntatoud/effect-og/image'

import font400 from './fonts/atkinson-hyperlegible-next-latin-400-normal.woff2?inline'
import font700 from './fonts/atkinson-hyperlegible-next-latin-700-normal.woff2?inline'

const FONT_FAMILY = 'Atkinson Hyperlegible Next'

export const OG_FONT_FAMILY = FONT_FAMILY

// The fonts are imported with Vite's `?inline` query, so their bytes are embedded
// as base64 data URLs directly in the server bundle. The previous approach read
// them from `node_modules` at runtime (`readFileSync(import.meta.resolve(...))`),
// which throws in the Netlify Lambda where those files are not bundled — and since
// this module is loaded during server startup, that ENOENT took down every route
// with an opaque 500. Inlining removes the runtime filesystem dependency entirely.
const dataUrlToBytes = (dataUrl: string): Buffer =>
  Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64')

/**
 * Font faces registered on the OG renderer. `takumi-js`'s `fonts` render option
 * is a no-op in v2.3.0 (verified: byte-identical output); registering faces on
 * the `Renderer` (which `@ntatoud/effect-og` does) is the only approach that
 * actually applies the custom font.
 */
export const OG_FONTS: OgFont[] = [
  { name: FONT_FAMILY, weight: 700, data: dataUrlToBytes(font700) },
  { name: FONT_FAMILY, weight: 400, data: dataUrlToBytes(font400) },
]
