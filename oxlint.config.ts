import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: [
    'typescript',
    'import',
    'unicorn',
    'import',
    'react',
    'react-perf',
    'promise',
  ],
  categories: {
    correctness: 'error',
  },
  env: {
    builtin: true,
    es2020: true,
    browser: true,
  },
  ignorePatterns: ['.source/', '.netlify/', 'dist/', 'src/**.gen.ts'],
  rules: {
    'unicorn/filename-case': ['error', { case: 'kebabCase' }],
    'no-rest-spread-properties': 'off',
  },
})
