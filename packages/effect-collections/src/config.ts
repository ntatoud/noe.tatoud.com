import { Context, Layer } from 'effect'

export type CollectionsConfigShape = {
  readonly contentRoot: string
  readonly assetBaseUrl: string
}

export class CollectionsConfig extends Context.Service<
  CollectionsConfig,
  CollectionsConfigShape
>()('effect-collections/CollectionsConfig') {
  static readonly layer = (config: CollectionsConfigShape) =>
    Layer.succeed(CollectionsConfig, config)
}
