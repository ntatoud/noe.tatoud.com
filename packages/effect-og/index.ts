// Client-safe metadata helpers (no `effect` dependency). The server-only image
// renderer lives in a separate entry point (`@ntatoud/effect-og/image`) so
// importing metadata never pulls Effect or the native `@takumi-rs/core`
// renderer into a browser bundle.
export { defineOgMetadata } from './metadata'
export type { MetaTag, OgMetadataConfig } from './metadata'
