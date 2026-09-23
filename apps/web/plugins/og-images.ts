import * as fs from 'node:fs'
import * as path from 'node:path'

import { createElement } from 'react'

import { OgImage, layer } from '@ntatoud/effect-og/image'
import type { OgFont } from '@ntatoud/effect-og/image'

import { Effect, ManagedRuntime } from 'effect'
import type { Plugin } from 'vite'

import { OG_FONT_FAMILY, OgCard } from '../src/features/og/og-card.tsx'
import type { OgKind } from '../src/features/og/og-card.tsx'
import { ogImagePath } from '../src/lib/site'

/** A page that gets a social card, and what the card shows. */
export interface OgPage {
  readonly path: string
  readonly title: string
  readonly description?: string
  readonly kind?: OgKind
}

const FONTS_DIRECTORY = 'src/features/og/fonts'

/**
 * Renders every page's social card to a PNG at build time, at the path
 * `ogImagePath` gives it (`/og/blog/what-is-mcp.png`), so no request ever runs
 * the renderer. The prerender pass cannot produce these: it reads every
 * response as text, which corrupts a binary body.
 *
 * Does nothing in `pnpm dev`: the meta tags point at absolute production URLs.
 */
export function ogImages(options: {
  pages: () => Promise<ReadonlyArray<OgPage>>
}): Plugin {
  let root = ''

  return {
    name: 'ntatoud:og-images',

    // Only the client build's output is published.
    applyToEnvironment: (environment) => environment.name === 'client',

    configResolved(config) {
      root = config.root
    },

    async generateBundle() {
      // Read from the app root rather than relative to `import.meta.url`: the
      // config loader bundles this file somewhere else before running it.
      const font = (weight: number) =>
        fs.readFileSync(
          path.join(
            root,
            FONTS_DIRECTORY,
            `atkinson-hyperlegible-next-latin-${weight}-normal.woff2`,
          ),
        )

      // Fonts are registered on the `Renderer`, which the `layer` does. Passing
      // them through `takumi-js`'s `fonts` render option instead is a no-op in
      // v2.3.0 (verified: byte-identical output), and the card silently falls
      // back to the default face.
      const fonts: OgFont[] = [
        { name: OG_FONT_FAMILY, weight: 700, data: font(700) },
        { name: OG_FONT_FAMILY, weight: 400, data: font(400) },
      ]
      const runtime = ManagedRuntime.make(
        layer({ fonts, width: 1200, height: 630 }),
      )

      try {
        const pages = await options.pages()
        const images = await runtime.runPromise(
          Effect.forEach(
            pages,
            ({ path: pagePath, title, description, kind }) =>
              OgImage.use((og) =>
                og.render(createElement(OgCard, { title, description, kind })),
              ).pipe(
                Effect.flatMap((response) =>
                  Effect.promise(() => response.arrayBuffer()),
                ),
                Effect.map((buffer) => ({
                  // `fileName` rather than `name`: the meta tags point at this
                  // exact path, so it must not go through `assetFileNames`
                  // hashing.
                  fileName: ogImagePath(pagePath).slice(1),
                  source: new Uint8Array(buffer),
                })),
              ),
            { concurrency: 4 },
          ),
        )

        for (const { fileName, source } of images) {
          this.emitFile({ type: 'asset', fileName, source })
        }
      } finally {
        await runtime.dispose()
      }
    },
  }
}
