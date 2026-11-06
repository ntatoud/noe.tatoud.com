import { createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    // Content only changes on deploy, so loader data never goes stale.
    defaultStaleTime: Infinity,
    defaultPreloadStaleTime: Infinity,
  })

  return router
}
