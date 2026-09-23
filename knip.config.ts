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
      ],
      project: ['src/**/*.{ts,tsx}'],
      ignoreDependencies: [
        // imported from src/styles/index.css, which knip does not follow
        '@fontsource-variable/fraunces',
        '@fontsource/atkinson-hyperlegible-next',
        '@fontsource/manrope',
        'shadcn',
        'tailwindcss',
        'tw-animate-css',
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
