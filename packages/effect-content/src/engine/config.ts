import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  CollectionsConfig,
  type CollectionsConfigShape,
} from 'effect-collections'

export type ContentConfigShape = CollectionsConfigShape

const ASSET_BASE_URL = '/content'

const defaultContentRoot = path.resolve(
  fileURLToPath(import.meta.url),
  '../../../../content/content',
)

export const ContentConfig = {
  layer: (contentRoot: string) =>
    CollectionsConfig.layer({ contentRoot, assetBaseUrl: ASSET_BASE_URL }),
  Default: CollectionsConfig.layer({
    contentRoot: defaultContentRoot,
    assetBaseUrl: ASSET_BASE_URL,
  }),
} as const
