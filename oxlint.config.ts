import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: [
    'typescript',
    'import',
    'unicorn',
    'react',
    'react-perf',
    'promise',
  ],
  jsPlugins: ['@shadcn/lint', './packages/oxlint-plugin/index.ts'],
  categories: {
    correctness: 'error',
  },
  env: {
    builtin: true,
    es2020: true,
    browser: true,
  },
  ignorePatterns: ['.netlify/', 'dist/', '**/*.gen.ts'],
  rules: {
    'unicorn/filename-case': ['error', { case: 'kebabCase' }],
    'no-rest-spread-properties': 'off',
    'ntatoud/one-line-comments': 'error',

    // Pages may place a component but not restyle it: styling is a variant in `components/ui/`.
    'shadcn/no-restyle': ['error', { allow: ['layout'] }],
    'shadcn/no-raw-colors': 'error',
    // `2lh` reserves two lines of text; no spacing-scale equivalent.
    'shadcn/no-arbitrary-values': ['error', { allow: ['min-h-[2lh]'] }],
    'shadcn/no-inline-styles': 'error',
    'shadcn/no-unknown-classes': 'error',
    'shadcn/require-static-classes': 'error',
  },
  overrides: [
    {
      // Vendored shadcn primitives: rewriting them would fork us off the CLI.
      files: ['apps/web/src/components/ui/**'],
      rules: {
        'shadcn/no-arbitrary-values': 'off',
      },
    },
    {
      // OG images render through Takumi: inline styles are the only channel.
      files: ['apps/web/src/features/og/**'],
      rules: {
        'shadcn/no-inline-styles': 'off',
      },
    },
    {
      // Decorative viewport-relative artwork, no design token fits.
      files: ['apps/web/src/components/background-glows.tsx'],
      rules: {
        'shadcn/no-arbitrary-values': 'off',
      },
    },
  ],
})
