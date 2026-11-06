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
    defaultViewTransition: {
      types: ({ fromLocation, toLocation, pathChanged }) => {
        if (!pathChanged) return false
        const depth = (path: string) => path.split('/').filter(Boolean).length
        const from = depth(fromLocation?.pathname ?? '/')
        const to = depth(toLocation.pathname)
        if (to > from) return ['forward']
        if (to < from) return ['back']
        return ['across']
      },
    },
  })

  return router
}
