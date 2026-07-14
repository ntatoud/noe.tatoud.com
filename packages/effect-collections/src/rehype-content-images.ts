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

/**
 * A rehype plugin that rewrites relative `<img src>` references in a Document's
 * body to their public asset URL (`<assetBaseUrl>/<collection>/<slug>/<file>`),
 * mirroring how frontmatter image refs are resolved. Absolute URLs and
 * root-absolute paths are left untouched. Runs during MDX compilation.
 */
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
