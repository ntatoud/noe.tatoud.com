// --- Meta tag primitives ---------------------------------------------------

/**
 * A single `<meta>`/`<title>` descriptor. Modeled as a union so every tag
 * emitted by {@link defineOgMetadata} is a fully-typed member rather than an
 * anonymous JSON object. The shapes line up with what most React
 * meta-frameworks accept in their `head`/`meta` APIs (e.g. TanStack Router).
 */
export type MetaTag =
  | { title: string }
  | { charSet: string }
  | { name: string; content: string }
  | { property: string; content: string }

// --- Configuration ---------------------------------------------------------

export interface OgMetadataConfig<Kinds extends ReadonlyArray<string>> {
  /** Absolute site origin, e.g. `https://example.com` (no trailing slash). */
  readonly siteUrl: string
  /** Value for `og:site_name`. */
  readonly siteName: string
  /**
   * Content kinds this site publishes. Drives the typed `OgKind` guard and the
   * `kind` query param on the OG image URL. Pass `[]` if the site has no kinds.
   */
  readonly kinds: Kinds
  /** Path of the OG image endpoint. @default '/api/og' */
  readonly imagePath?: string
  /** Default `og:type`. @default 'website' */
  readonly ogType?: string
  /** Default `twitter:card`. @default 'summary_large_image' */
  readonly twitterCard?: string
  /** OG image width in px. @default 1200 */
  readonly imageWidth?: number
  /** OG image height in px. @default 630 */
  readonly imageHeight?: number
}

// --- Factory ---------------------------------------------------------------

/**
 * Build a typesafe, composable OG/metadata toolkit bound to a site's config.
 *
 * `toMetaTags` derives the concrete, deduplicated tag list from a page's
 * semantic description. Site-wide values (`ogType`, `siteName`,
 * `twitterCard`) are baked in as defaults, so a page only specifies what
 * differs and may still override any of them.
 *
 * Kept dependency-free (no `effect`) since this module is imported from the
 * root route and ships in every client bundle.
 */
export function defineOgMetadata<const Kinds extends ReadonlyArray<string>>(
  config: OgMetadataConfig<Kinds>,
) {
  const {
    siteUrl,
    siteName,
    kinds,
    imagePath = '/api/og',
    ogType = 'website',
    twitterCard = 'summary_large_image',
    imageWidth = 1200,
    imageHeight = 630,
  } = config

  type OgKind = Kinds[number]
  const kindSet = new Set<string>(kinds)

  /** Runtime guard for `OgKind` — use to validate untrusted input (e.g. query params). */
  const isOgKind = (value: unknown): value is OgKind =>
    typeof value === 'string' && kindSet.has(value)

  /** Semantic, page-level metadata — the composable surface routes describe. */
  interface PageMetadataInput {
    /** Document title — drives `<title>`, `og:title`, and `twitter:title`. */
    title: string
    /** Summary — drives `description`, `og:description`, `twitter:description`. */
    description?: string
    /** Canonical pathname, e.g. `/blog/my-post` — drives `og:url`. */
    path?: string
    /** Content kind — drives the OG image badge. */
    kind?: OgKind
    ogType?: string
    siteName?: string
    twitterCard?: string
  }

  /** Build the OG image endpoint URL for a page. */
  const buildOgImageUrl = (params: {
    title: string
    description?: string
    kind?: OgKind
  }) => {
    const search = new URLSearchParams({ title: params.title })
    if (params.description) search.set('description', params.description)
    if (params.kind) search.set('kind', params.kind)
    return `${siteUrl}${imagePath}?${search.toString()}`
  }

  /** Site-wide tags for the root document, never repeated per page. */
  const BASE_META_TAGS: MetaTag[] = [
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ]

  /** Derive the full, deduplicated set of meta tags for a page. */
  const toMetaTags = (input: PageMetadataInput): MetaTag[] => {
    const {
      title,
      description,
      path = '/',
      kind,
      ogType: pageOgType = ogType,
      siteName: pageSiteName = siteName,
      twitterCard: pageTwitterCard = twitterCard,
    } = input
    const url = `${siteUrl}${path}`
    const image = buildOgImageUrl({ title, description, kind })

    return [
      { title },
      ...(description ? [{ name: 'description', content: description }] : []),
      { property: 'og:type', content: pageOgType },
      { property: 'og:site_name', content: pageSiteName },
      { property: 'og:title', content: title },
      ...(description
        ? [{ property: 'og:description', content: description }]
        : []),
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: String(imageWidth) },
      { property: 'og:image:height', content: String(imageHeight) },
      { name: 'twitter:card', content: pageTwitterCard },
      { name: 'twitter:url', content: url },
      { name: 'twitter:title', content: title },
      ...(description
        ? [{ name: 'twitter:description', content: description }]
        : []),
      { name: 'twitter:image', content: image },
    ]
  }

  return {
    isOgKind,
    buildOgImageUrl,
    BASE_META_TAGS,
    toMetaTags,
  }
}
