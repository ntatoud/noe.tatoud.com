import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  workspaces: {
    'packages/content': {
      entry: ['content-collections.ts'],
      project: ['**/*.{ts,tsx}'],
      ignoreDependencies: ['@content-collections/vite'],
    },
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
  rules: {
    enumMembers: 'off',
    binaries: 'off',
  },
  ignoreExportsUsedInFile: false,
}

export default config
