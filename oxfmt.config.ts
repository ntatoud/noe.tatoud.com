import { defineConfig } from 'oxfmt'

export default defineConfig({
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 80,
  ignorePatterns: [
    'package-lock.json',
    'pnpm-lock.yaml',
    'yarn.lock',
    '**/*.gen.ts',
    // Vendored verbatim, kept diffable against upstream.
    '.claude/skills/**',
  ],
  sortImports: {
    newlinesBetween: true,
    customGroups: [
      { groupName: 'react', elementNamePattern: ['react'] },
      {
        groupName: 'main-external',
        elementNamePattern: ['@tanstack/**', '@ntatoud/**'],
      },
    ],
    groups: [
      'builtin',
      'react',
      'main-external',
      'external',
      'internal',
      ['parent', 'sibling', 'index'],
      'style',
      'unknown',
    ],
  },
})
