import { readFileSync } from 'node:fs'

import type { OgFont } from '@ntatoud/effect-og/image'

function readFont(specifier: string) {
  return readFileSync(new URL(import.meta.resolve(specifier)))
}

const FONT_FAMILY = 'Atkinson Hyperlegible Next'

const FONT_WEIGHTS = [
  {
    weight: 700,
    file: 'atkinson-hyperlegible-next-latin-700-normal.woff2',
  },
  {
    weight: 400,
    file: 'atkinson-hyperlegible-next-latin-400-normal.woff2',
  },
]

export const OG_FONT_FAMILY = FONT_FAMILY

/**
 * Font faces registered on the OG renderer. `takumi-js`'s `fonts` render option
 * is a no-op in v2.3.0 (verified: byte-identical output); registering faces on
 * the `Renderer` (which `@ntatoud/effect-og` does) is the only approach that
 * actually applies the custom font.
 */
export const OG_FONTS: OgFont[] = FONT_WEIGHTS.map(({ weight, file }) => ({
  name: FONT_FAMILY,
  weight,
  data: readFont(`@fontsource/atkinson-hyperlegible-next/files/${file}`),
}))
