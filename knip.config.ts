import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: [
    // TanStack Start / Vite entry
    'src/router.tsx',
    'source.config.ts',
    // File-based routes (TanStack Router)
    'src/routes/**/*.{ts,tsx}',
    // OG image handler
    'src/features/og/**/*.{ts,tsx}',
  ],
  project: ['src/**/*.{ts,tsx}'],
  ignoreDependencies: [
    // Packages loaded via CSS @import, not JS imports
    '@fontsource/atkinson-hyperlegible',
    'shadcn',
    'tw-animate-css',
    // Unlisted but transitive deps re-exported by fumadocs
    'zod',
    'clsx',
    // @tanstack/hotkeys is the actual package behind react-hotkeys
    '@tanstack/hotkeys',
    // achievements is a bundled type from achievements-react
    'achievements',
    // Testing: used in vitest setup / test files not tracked as entry
    '@testing-library/dom',
    '@testing-library/react',
    // MDX types used in tsconfig.json, not direct imports
    '@types/mdx',
  ],
  rules: {
    // TanStack Router generates enum-like route trees
    enumMembers: 'off',
    // oxlint binary is resolved via oxlint package
    binaries: 'off',
  },
  ignoreExportsUsedInFile: false,
}

export default config
