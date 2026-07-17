import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  workspaces: {
    'apps/web': {
      entry: ['src/router.tsx', 'src/routes/**/__root.tsx', 'src/lib/utils.ts'],
      project: ['src/**/*.{ts,tsx}'],
      ignoreDependencies: [
        '@fontsource/atkinson-hyperlegible',
        '@tailwindcss/typography',
        'class-variance-authority',
        'shadcn',
        'tailwindcss',
        'tw-animate-css',
      ],
    },
  },
  project: ['*.config.ts'],
  rules: {
    enumMembers: 'off',
    binaries: 'off',
  },
  ignoreExportsUsedInFile: false,
}

export default config
