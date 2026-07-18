import type { ReactNode } from 'react'

import type { FontDetails } from '@takumi-rs/core'
import { Renderer } from '@takumi-rs/core'
import { Context, Effect, Layer, ManagedRuntime } from 'effect'
import { ImageResponse } from 'takumi-js/response'
import type { ImageResponseOptions } from 'takumi-js/response'

import { OgImageError } from './errors'

export { OgImageError } from './errors'

/** A font face to register on the OG renderer — alias of Takumi's `FontDetails`. */
export type OgFont = FontDetails

/** Per-render overrides (dimensions, headers, ...); `renderer`/`format` are fixed. */
export interface OgRenderOptions extends Omit<
  ImageResponseOptions,
  'renderer' | 'format'
> {}

export interface OgImageConfig {
  /** Fonts registered once when the renderer is first built. */
  readonly fonts?: ReadonlyArray<OgFont>
  /** Default image width in px. @default 1200 */
  readonly width?: number
  /** Default image height in px. @default 630 */
  readonly height?: number
  /** Default response headers merged into every render (e.g. cache-control). */
  readonly headers?: HeadersInit
}

export interface OgImageShape {
  /** Render a React element to a PNG `ImageResponse`. */
  readonly render: (
    element: ReactNode,
    options?: OgRenderOptions,
  ) => Effect.Effect<ImageResponse, OgImageError>
}

/** Effect service tag for OG image rendering. Provide it with {@link layer}. */
export class OgImage extends Context.Service<OgImage, OgImageShape>()(
  'effect-og/OgImage',
) {}

/**
 * Build the `OgImage` layer. Fonts are registered once while the layer is
 * constructed and reused for every render served through it.
 */
export const layer = (
  config: OgImageConfig = {},
): Layer.Layer<OgImage, OgImageError> =>
  Layer.effect(
    OgImage,
    Effect.gen(function* () {
      const renderer = yield* Effect.tryPromise({
        try: async () => {
          const instance = new Renderer()
          for (const font of config.fonts ?? []) {
            await instance.registerFont(font)
          }
          return instance
        },
        catch: (cause) =>
          new OgImageError({ operation: 'registerFonts', cause }),
      })

      const width = config.width ?? 1200
      const height = config.height ?? 630

      return OgImage.of({
        render: (element, options) =>
          Effect.try({
            try: () =>
              new ImageResponse(element, {
                width,
                height,
                headers: config.headers,
                ...options,
                format: 'png',
                renderer,
              }),
            catch: (cause) => new OgImageError({ operation: 'render', cause }),
          }),
      })
    }),
  )

export interface OgImageRuntime {
  /** Render a React element to a PNG `ImageResponse`. */
  readonly render: (
    element: ReactNode,
    options?: OgRenderOptions,
  ) => Promise<ImageResponse>
  /** Dispose the underlying runtime, releasing the renderer. */
  readonly dispose: () => Promise<void>
}

/**
 * Promise-based convenience wrapper — the "server function" for OG images.
 *
 * Returns a ready-to-use renderer backed by a memoized runtime: fonts load
 * lazily on the first render and are reused thereafter. Ideal for a route
 * handler that returns `render(<Card .../>)` directly.
 */
export const makeOgImage = (config?: OgImageConfig): OgImageRuntime => {
  const runtime = ManagedRuntime.make(layer(config))
  return {
    render: (element, options) =>
      runtime.runPromise(OgImage.use((og) => og.render(element, options))),
    dispose: () => runtime.dispose(),
  }
}
