import { defineConfig } from 'oxfmt'

export default defineConfig({
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 80,
  ignorePatterns: ['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock'],
  experimentalTailwindcss: {
    attributes: ['class', 'className'],
    functions: ['cva', 'cn'],
    stylesheet: './src/styles.css',
  },
  sortImports: {
    newlinesBetween: true,
    customGroups: [
      { groupName: 'react', elementNamePattern: ['react'] },
      {
        groupName: 'main-external',
        elementNamePattern: ['@tanstack/**', '@fumadocs/**', 'fumadocs'],
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
