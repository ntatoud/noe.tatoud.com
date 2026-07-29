/**
 * Stand-in for the `shiki` package, aliased in by `apps/web/vite.config.ts`.
 *
 * `rehype-pretty-code` does a static `import { getSingletonHighlighter } from
 * 'shiki'`, which drags shiki's entire bundled-grammar registry into the build
 * even though we always hand it an explicit `getHighlighter`. Aliasing `shiki`
 * to this module keeps that registry out of the bundle while still honouring
 * the import. Subpaths (`shiki/core`, `shiki/langs/*`, …) resolve normally.
 */
export { getHighlighter as getSingletonHighlighter } from './highlighter'
