import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  CollectionsConfig,
  type CollectionsConfigShape,
} from 'effect-collections'

/**
 * The site's content config shape — the core's {@link CollectionsConfigShape}
 * (`contentRoot` + `assetBaseUrl`). Kept as a named re-export so the package's
 * public API is unchanged.
 */
export type ContentConfigShape = CollectionsConfigShape

/** Content images are served statically under `/content` (ADR-0008). */
const ASSET_BASE_URL = '/content'

/**
 * Absolute path to the content root. The default points at the existing
 * `packages/content/content` tree (ADR-0006); tests and the app can override it.
 */
const defaultContentRoot = path.resolve(
  fileURLToPath(import.meta.url),
  '../../../../content/content',
)

/**
 * Builds the core's `CollectionsConfig` Layer for this site, filling in the
 * fixed `/content` asset base so callers keep passing a single `contentRoot`.
 */
export const ContentConfig = {
  /** Config Layer pointing at an explicit content root. */
  layer: (contentRoot: string) =>
    CollectionsConfig.layer({ contentRoot, assetBaseUrl: ASSET_BASE_URL }),
  /** Config Layer pointing at the repository's `packages/content/content` tree. */
  Default: CollectionsConfig.layer({
    contentRoot: defaultContentRoot,
    assetBaseUrl: ASSET_BASE_URL,
  }),
} as const
