import { defineOgMetadata } from '@ntatoud/effect-og'

import { SITE_NAME, SITE_URL, ogImagePath } from '@/lib/site'

/**
 * OG/metadata toolkit bound to this site. See `@ntatoud/effect-og` for the
 * schema and helpers; this module just supplies the site-specific config. The
 * images themselves are rendered at build time (ADR-0010).
 */
export const { toMetaTags, BASE_META_TAGS } = defineOgMetadata({
  siteUrl: SITE_URL,
  siteName: SITE_NAME,
  imagePath: ogImagePath,
})
