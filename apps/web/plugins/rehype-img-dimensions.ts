import * as fs from 'node:fs'
import * as path from 'node:path'

import { imageSize } from 'image-size'
import { visit } from 'unist-util-visit'

/**
 * Rehype plugin that reads local image dimensions from disk and adds
 * explicit width/height attributes to <img> elements.
 *
 * Must run BEFORE rehype-mdx-import-media so src is still a relative path.
 * Uses the vfile's directory to resolve relative paths for each MDX file.
 */
const rehypeImgDimensions = () => (tree: any, file: any) => {
  const fileDir = file.path ? path.dirname(file.path) : process.cwd()

  visit(tree, 'element', (node: any) => {
    if (node.tagName !== 'img') return
    const src = node.properties?.src
    if (!src || typeof src !== 'string') return
    if (src.startsWith('http') || src.startsWith('data:')) return
    if (node.properties.width && node.properties.height) return

    try {
      const absPath = path.resolve(fileDir, src)
      const buf = fs.readFileSync(absPath)
      const { width, height } = imageSize(buf)
      if (width && height) {
        node.properties.width = width
        node.properties.height = height
      }
    } catch {
      // Image not found or unsupported format — skip silently
    }
  })
}

export default rehypeImgDimensions
