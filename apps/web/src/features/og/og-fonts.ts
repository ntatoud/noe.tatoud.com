import { readFileSync } from 'node:fs'

import { Renderer } from '@takumi-rs/core'

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

/**
 * `takumi-js`'s `fonts` render option is a no-op in v2.3.0 (verified
 * manually: passing it produces byte-identical output to omitting it).
 * Registering fonts on a `Renderer` instance and passing that `renderer`
 * to `render`/`ImageResponse` is the only approach that actually applies
 * the custom font.
 */
let rendererPromise: Promise<Renderer> | undefined

export function getOgRenderer() {
  rendererPromise ??= (async () => {
    const renderer = new Renderer()
    for (const { weight, file } of FONT_WEIGHTS) {
      await renderer.registerFont({
        name: FONT_FAMILY,
        weight,
        data: readFont(`@fontsource/atkinson-hyperlegible-next/files/${file}`),
      })
    }
    return renderer
  })()
  return rendererPromise
}

export const OG_FONT_FAMILY = FONT_FAMILY
