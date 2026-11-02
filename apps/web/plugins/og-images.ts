import * as fs from 'node:fs'
import * as path from 'node:path'

import { createElement } from 'react'

import type { SitePage } from '@ntatoud/content/inventory'

import { Renderer } from '@takumi-rs/core'
import type { FontDetails } from '@takumi-rs/core'
import { render } from 'takumi-js'
import type { Plugin } from 'vite'

import { OG_FONT_FAMILY, OgCard } from '../src/features/og/og-card.tsx'

type OgPage = Pick<SitePage, 'ogImage' | 'title' | 'description' | 'kind'>

const FONTS_DIRECTORY = 'src/features/og/fonts'

// Emitted as files: the prerender pass reads responses as text and would corrupt PNGs.
export function ogImages(options: { pages: ReadonlyArray<OgPage> }): Plugin {
  let root = ''

  return {
    name: 'ntatoud:og-images',

    applyToEnvironment: (environment) => environment.name === 'client',

    configResolved(config) {
      root = config.root
    },

    async generateBundle() {
      // Not relative to `import.meta.url`: the config loader bundles this file elsewhere.
      const font = (weight: number) =>
        fs.readFileSync(
          path.join(
            root,
            FONTS_DIRECTORY,
            `atkinson-hyperlegible-next-latin-${weight}-normal.woff2`,
          ),
        )

      // Register fonts on the `Renderer`: takumi-js's `fonts` render option is a no-op in v2.3.0.
      const fonts: FontDetails[] = [
        { name: OG_FONT_FAMILY, weight: 700, data: font(700) },
        { name: OG_FONT_FAMILY, weight: 400, data: font(400) },
      ]
      const renderer = new Renderer()
      for (const face of fonts) await renderer.registerFont(face)

      for (const { ogImage, title, description, kind } of options.pages) {
        const source = await render(
          createElement(OgCard, { title, description, kind }),
          { width: 1200, height: 630, format: 'png', renderer },
        )
        this.emitFile({
          type: 'asset',
          // `fileName`, not `name`: the meta tags need the unhashed path.
          fileName: ogImage.slice(1),
          source,
        })
      }
    },
  }
}
