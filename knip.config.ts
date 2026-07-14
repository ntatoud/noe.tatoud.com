import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  workspaces: {
    'apps/web': {
      entry: ['src/router.tsx', 'src/routes/**/__root.tsx', 'src/lib/utils.ts'],
      project: ['src/**/*.{ts,tsx}', 'plugins/**/*.ts'],
      ignoreDependencies: [
        '@fontsource/atkinson-hyperlegible',
        '@tailwindcss/typography',
        '@types/mdx',
        'class-variance-authority',
        'shadcn',
        'tailwindcss',
        'tw-animate-css',
      ],
    },
  },
  project: ['*.config.ts'],
  // `@ntatoud/content` is retained as a backup during the Effect content
  // pipeline migration (ADR-0006) — Blog, Projects, and Experiences are
  // fully ported and Talks is its only remaining consumer, so most of the
  // package now reads as dead code from knip's perspective. Excluded
  // wholesale rather than piecemeal-ignored until the deferred cleanup
  // drops the package entirely.
  ignoreWorkspaces: ['packages/content'],
  // Only used by the now-ignored `packages/content` build script.
  ignoreDependencies: ['@content-collections/cli'],
  rules: {
    enumMembers: 'off',
    binaries: 'off',
  },
  ignoreExportsUsedInFile: false,
}

export default config
