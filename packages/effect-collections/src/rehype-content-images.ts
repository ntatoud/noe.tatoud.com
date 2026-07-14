import { assetUrl, isRelativeRef } from '#core/image'

export type RehypeContentImagesOptions = {
  readonly assetBaseUrl: string
  readonly collection: string
  readonly slug: string
}

type HastNode = {
  type?: string
  tagName?: string
  properties?: Record<string, unknown> | null
  children?: ReadonlyArray<HastNode> | null
}

export const rehypeContentImages =
  (options: RehypeContentImagesOptions) =>
  (tree: HastNode): undefined => {
    const rewrite = (node: HastNode): void => {
      if (
        node.tagName === 'img' &&
        node.properties &&
        typeof node.properties.src === 'string' &&
        isRelativeRef(node.properties.src)
      ) {
        node.properties.src = assetUrl(
          options.assetBaseUrl,
          options.collection,
          options.slug,
          node.properties.src,
        )
      }
      if (node.children) {
        for (const child of node.children) rewrite(child)
      }
    }
    rewrite(tree)
    return undefined
  }
