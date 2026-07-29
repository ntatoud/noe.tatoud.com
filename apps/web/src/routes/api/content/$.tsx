import { createFileRoute } from '@tanstack/react-router'

import { contentWebHandler } from '@/server/content-api'
import { CONTENT_CACHE_HEADERS } from '@/server/content-document'

/**
 * Mounts the content `HttpApi` on the App's own HTTP surface, so the browser can
 * reach its GET endpoints during client-side navigation. SSR bypasses this route
 * entirely and runs the same handlers in-process.
 *
 * A splat: the router inside `contentWebHandler` owns everything below
 * `/api/content`, so route paths live in the contract rather than being
 * mirrored in the filesystem.
 */
export const Route = createFileRoute('/api/content/$')({
  server: {
    handlers: {
      async GET({ request }) {
        const response = await contentWebHandler(request)
        // Only successes are cacheable — a durable edge entry for a 404 would
        // outlive the deploy that adds the missing post.
        if (!response.ok) return response
        for (const [name, value] of Object.entries(CONTENT_CACHE_HEADERS)) {
          response.headers.set(name, value)
        }
        return response
      },
    },
  },
})
