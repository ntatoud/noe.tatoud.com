import { createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: false,
    // Start fetching loader data as soon as a link is hovered/focused, so
    // navigation feels instant instead of waiting on the server-fn RPC.
    defaultPreload: 'intent',
    // Content only changes on deploy (full page loads always SSR fresh data),
    // so loader data never goes stale within a browsing session.
    defaultStaleTime: Infinity,
    defaultPreloadStaleTime: Infinity,
  })

  return router
}
