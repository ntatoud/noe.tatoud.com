import { isRelativeRef } from './image'

/** Markdown image syntax: `![alt](./x.png "optional title")`. */
const MARKDOWN_IMAGE = /!\[[^\]]*\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/g

/** Literal JSX/HTML `<img src="./x.png">` embedded directly in a body. */
const JSX_IMG_SRC = /<img\b[^>]*\bsrc=["']([^"']+)["']/gi

/**
 * Extracts relative, local image references from a raw MDX body — both
 * Markdown image syntax and literal `<img src="...">` — via a plain regex
 * scan of the source text, without running the MDX/unified compile
 * pipeline. Used by the build-time content validator so a missing body
 * image can be reported even when compilation itself would otherwise
 * mask it (`resolveImage` swallows unreadable files into a still-successful,
 * dimension-less result). External URLs, root-relative paths, and data URIs
 * are excluded — the same rule `rehypeContentImages` applies at render time.
 */
export const collectImageRefs = (source: string): ReadonlyArray<string> => {
  const refs: string[] = []

  for (const match of source.matchAll(MARKDOWN_IMAGE)) {
    const ref = match[1]
    if (ref && isRelativeRef(ref)) refs.push(ref)
  }

  for (const match of source.matchAll(JSX_IMG_SRC)) {
    const ref = match[1]
    if (ref && isRelativeRef(ref)) refs.push(ref)
  }

  return refs
}
