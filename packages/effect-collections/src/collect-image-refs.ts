import { isRelativeRef } from '#core/image'

const MARKDOWN_IMAGE = /!\[[^\]]*\]\(\s*([^)\s]+)/g
const HTML_IMAGE = /<img\b[^>]*?\bsrc\s*=\s*["']([^"']+)["']/gi

/**
 * Scans a raw MDX/Markdown body for the relative image references it embeds —
 * both Markdown `![alt](./x.png)` and inline `<img src="./x.png">`. Returns each
 * distinct relative reference once, in first-seen order. Absolute URLs and
 * root-absolute paths are ignored. Pure: no I/O.
 */
export const collectImageRefs = (body: string): ReadonlyArray<string> => {
  const refs = new Set<string>()
  for (const match of body.matchAll(MARKDOWN_IMAGE)) {
    if (isRelativeRef(match[1])) refs.add(match[1])
  }
  for (const match of body.matchAll(HTML_IMAGE)) {
    if (isRelativeRef(match[1])) refs.add(match[1])
  }
  return [...refs]
}
