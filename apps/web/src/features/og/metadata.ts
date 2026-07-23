import { defineOgMetadata } from '@ntatoud/effect-og'

import { SITE_URL } from '@/lib/site'

/**
 * OG/metadata toolkit bound to this site. See `@ntatoud/effect-og` for the
 * schema and helpers; this module just supplies the site-specific config.
 */
const OG_KINDS = ['blog', 'project', 'talk'] as const

export const { isOgKind, toMetaTags, BASE_META_TAGS } = defineOgMetadata({
  siteUrl: SITE_URL,
  siteName: 'noe.tatoud.com',
  kinds: OG_KINDS,
})

export type OgKind = (typeof OG_KINDS)[number]
