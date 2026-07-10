import * as fs from 'node:fs'
import * as path from 'node:path'

import { imageSize } from 'image-size'

/** Reads an image file and returns its pixel dimensions, or null if unreadable. */
export function getHeroDimensions(
  filePath: string,
): { width: number; height: number } | null {
  try {
    const { width, height } = imageSize(fs.readFileSync(filePath))
    if (!width || !height) return null
    return { width, height }
  } catch {
    return null
  }
}

/** Reads a logo file and returns a base64 data URL with the correct MIME type, or null if unreadable. */
export function encodeLogoDataUrl(filePath: string): string | null {
  try {
    const ext = path.extname(filePath).slice(1).toLowerCase()
    const mimeType =
      ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`
    const base64 = fs.readFileSync(filePath).toString('base64')
    return `data:${mimeType};base64,${base64}`
  } catch {
    return null
  }
}
