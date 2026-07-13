import type { RegisteredRouter } from '@tanstack/react-router'

/** Strict union of all app route `to` paths (from the generated route tree). */
export type RouteTo =
  RegisteredRouter['routeTree']['types']['fileRouteTypes']['to']
