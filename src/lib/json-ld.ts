import type { Thing, WithContext } from 'schema-dts'

/**
 * Wraps a schema.org object into a TanStack Router meta entry
 * that renders as <script type="application/ld+json"> in the head.
 */
export function jsonLd<T extends Thing>(schema: WithContext<T>) {
  return { 'script:ld+json': schema } as never
}
