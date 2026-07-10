import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: [],
  project: ['apps/**/*.{ts,tsx}', 'packages/**/*.{ts,tsx}'],
  rules: {
    enumMembers: 'off',
    binaries: 'off',
  },
  ignoreExportsUsedInFile: false,
}

export default config
