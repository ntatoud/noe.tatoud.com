import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import { Context, Layer } from 'effect'

/**
 * Absolute path to the content root. The default points at the existing
 * `packages/content/content` tree (ADR-0006); tests and the app can override it.
 */
export type ContentConfigShape = {
  readonly contentRoot: string
}

const defaultContentRoot = path.resolve(
  fileURLToPath(import.meta.url),
  '../../../../content/content',
)

export class ContentConfig extends Context.Service<
  ContentConfig,
  ContentConfigShape
>()('@ntatoud/effect-content/ContentConfig') {
  /** Builds a config Layer pointing at an explicit content root. */
  static readonly layer = (contentRoot: string) =>
    Layer.succeed(ContentConfig, { contentRoot })

  /** Config Layer pointing at the repository's `packages/content/content` tree. */
  static readonly Default = Layer.succeed(ContentConfig, {
    contentRoot: defaultContentRoot,
  })
}
