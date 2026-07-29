import type { ReactNode } from 'react'

import type { OgRenderOptions } from '@ntatoud/effect-og/image'

import { OgImage, runtime } from '@/server/runtime'

/**
 * Render a React element to a PNG `ImageResponse` through the shared App
 * runtime. Fonts are registered once when the runtime's `OgImage` layer is
 * first built and reused for every render thereafter.
 */
export const renderOgImage = (element: ReactNode, options?: OgRenderOptions) =>
  runtime.runPromise(OgImage.use((og) => og.render(element, options)))
