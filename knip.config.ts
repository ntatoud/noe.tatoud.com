import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  workspaces: {
    '.': {
      entry: ['*.config.ts'],
    },
    'apps/web': {
      entry: [
        'src/routes/**/__root.tsx',
        'src/lib/utils.ts',
        // shadcn primitives: keep their full export surface
        'src/components/ui/*.tsx',
        'scripts/*.ts',
      ],
      project: ['src/**/*.{ts,tsx}', 'plugins/*.ts'],
      // Knip's Vite plugin executes the config to read it, through a loader
      // that cannot parse JSX, and the config now imports the OG card via
      // `plugins/og-images.ts`. Knip still treats the config as an entry and
      // follows its imports statically. There is no `index.html` or Vitest
      // setup here for the plugin to discover.
      vite: false,
      ignoreDependencies: [
        // imported from src/styles/index.css, which knip does not follow
        '@fontsource-variable/fraunces',
        '@fontsource-variable/manrope',
        '@fontsource/atkinson-hyperlegible-next',
        'tailwindcss',
      ],
    },
  },
  rules: {
    enumMembers: 'off',
    binaries: 'off',
  },
  ignoreExportsUsedInFile: false,
}

export default config
