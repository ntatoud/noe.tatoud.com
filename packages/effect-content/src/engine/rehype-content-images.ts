import { FileSystem, Path } from '@effect/platform'
import { Runtime } from 'effect'

import { isRelativeRef, resolveImage } from './image'

export type RehypeContentImagesOptions = {
  readonly contentRoot: string
  readonly collection: string
  readonly slug: string
  /**
   * Runtime captured by the caller (`compileMdxBody`) so `resolveImage`'s
   * `FileSystem`/`Path` requirement can be satisfied from inside this
   * plain-Promise rehype callback.
   */
  readonly runtime: Runtime.Runtime<FileSystem.FileSystem | Path.Path>
}

/** Minimal hast shape this module cares about — a plain tree walk, no `unist-util-visit` dependency needed. */
type HastNode = {
  type?: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
}

const collectImgNodes = (node: HastNode, out: HastNode[]): void => {
  if (node.type === 'element' && node.tagName === 'img') out.push(node)
  if (node.children) {
    for (const child of node.children) collectImgNodes(child, out)
  }
}

/**
 * Rehype step that rewrites relative markdown-image srcs (`![](./x.png)`)
 * inside a Document body to the same `/content/<collection>/<slug>/<path>`
 * URL the frontmatter hero already resolves to, stamping on-disk
 * `width`/`height` (ADR-0008, same rule for body refs and hero refs). Runs
 * server-side as part of MDX compilation — never in the client bundle.
 */
export const rehypeContentImages =
  (options: RehypeContentImagesOptions) => async (tree: HastNode) => {
    const nodes: HastNode[] = []
    collectImgNodes(tree, nodes)

    await Promise.all(
      nodes.map(async (node) => {
        const src = node.properties?.src
        if (typeof src !== 'string' || !isRelativeRef(src)) return

        const resolved = await Runtime.runPromise(options.runtime)(
          resolveImage(
            options.contentRoot,
            options.collection,
            options.slug,
            src,
          ),
        )

        if (!node.properties) node.properties = {}
        node.properties.src = resolved.url
        if (resolved.width !== null) node.properties.width = resolved.width
        if (resolved.height !== null) node.properties.height = resolved.height
      }),
    )
  }
