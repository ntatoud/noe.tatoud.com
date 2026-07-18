import { makeOgImage } from '@ntatoud/effect-og/image'

import { OG_FONTS } from '@/features/og/og-fonts'

/** Shared OG image renderer — fonts load once and the runtime is reused. */
export const ogImage = makeOgImage({
  fonts: OG_FONTS,
  width: 1200,
  height: 630,
  headers: {
    'Cache-Control': 'public, immutable, max-age=31536000',
  },
})
