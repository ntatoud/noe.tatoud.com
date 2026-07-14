import * as fs from 'node:fs/promises'
import * as path from 'node:path'

import { Effect } from 'effect'
import { imageSize } from 'image-size'

export type ResolvedImage = {
  readonly url: string
  readonly width: number | null
  readonly height: number | null
}

/**
 * Resolves an image reference relative to a Document's directory to a stable
 * `/content/<collection>/<slug>/<path>` URL and stamps its on-disk dimensions.
 * A reference that cannot be read still yields the URL with null dimensions.
 */
export const resolveImage = (
  contentRoot: string,
  collection: string,
  slug: string,
  ref: string,
): Effect.Effect<ResolvedImage> => {
  const cleaned = ref.replace(/^\.\//, '')
  const url = `/content/${collection}/${slug}/${cleaned}`.replace(
    /\/{2,}/g,
    '/',
  )
  const filePath = path.join(contentRoot, collection, slug, cleaned)

  return Effect.tryPromise(() => fs.readFile(filePath)).pipe(
    Effect.map((buffer) => {
      const size = imageSize(buffer)
      return {
        url,
        width: size.width ?? null,
        height: size.height ?? null,
      }
    }),
    Effect.orElseSucceed(
      (): ResolvedImage => ({ url, width: null, height: null }),
    ),
  )
}
