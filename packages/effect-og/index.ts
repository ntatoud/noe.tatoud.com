// Client-safe metadata schema + helpers. The server-only image renderer lives
// in a separate entry point (`@ntatoud/effect-og/image`) so importing metadata
// never pulls the native `@takumi-rs/core` renderer into a browser bundle.
export { MetaTag, defineOgMetadata } from './metadata'
export type { OgMetadataConfig } from './metadata'
