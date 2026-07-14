import { Context, Layer } from 'effect'

/**
 * Runtime configuration for a content workspace.
 *
 * - `contentRoot` — absolute path to the directory that holds one sub-directory
 *   per collection (`<contentRoot>/<collection>/<slug>/index.mdx`). Read only.
 * - `assetBaseUrl` — the public URL prefix under which the collection asset tree
 *   is served. Resolved image/logo URLs are built as
 *   `<assetBaseUrl>/<collection>/<slug>/<file>`. The core never hardcodes this;
 *   consumers pass whatever their deployment serves (e.g. `/content`).
 */
export type CollectionsConfigShape = {
  readonly contentRoot: string
  readonly assetBaseUrl: string
}

/**
 * The config service. It carries no default — the core is content-agnostic and
 * has no opinion about where content lives or how assets are served, so every
 * consumer builds its own Layer with {@link CollectionsConfig.layer}.
 */
export class CollectionsConfig extends Context.Service<
  CollectionsConfig,
  CollectionsConfigShape
>()('effect-collections/CollectionsConfig') {
  /** Builds a config Layer from an explicit shape. */
  static readonly layer = (config: CollectionsConfigShape) =>
    Layer.succeed(CollectionsConfig, config)
}
