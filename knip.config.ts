import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  workspaces: {
    'packages/content': {
      entry: ['content-collections.ts'],
      project: ['**/*.{ts,tsx}'],
      ignoreDependencies: ['@content-collections/vite'],
    },
  },
  project: ['apps/**/*.{ts,tsx}', '*.config.ts'],
  rules: {
    enumMembers: 'off',
    binaries: 'off',
  },
  ignoreExportsUsedInFile: false,
}

export default config
