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
        'vite.config.ts',
      ],
      // `.css` so knip follows the stylesheet `@import`s (tailwindcss,
      // fontsource) instead of reporting them unused.
      project: ['src/**/*.{ts,tsx,css}', 'plugins/*.ts'],
      // Knip's Vite plugin executes the config to read it, through a loader
      // that cannot parse JSX, and the config now imports the OG card via
      // `plugins/og-images.ts`. With the plugin off, the config is listed as
      // an entry above so knip follows its imports statically. There is no
      // `index.html` or Vitest setup here for the plugin to discover.
      vite: false,
    },
  },
  rules: {
    enumMembers: 'off',
    binaries: 'off',
  },
  ignoreExportsUsedInFile: false,
}

export default config
