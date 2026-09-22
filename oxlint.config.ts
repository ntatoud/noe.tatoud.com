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
  // `@shadcn/lint` reads `apps/web/components.json` for the UI directory and
  // the Tailwind theme.
  jsPlugins: ['@shadcn/lint'],
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

    // Pages may place a component (margin, width, flex) but not restyle it.
    // Color, typography, spacing, shape, effects and motion belong to the
    // component, as a variant in `components/ui/`.
    'shadcn/no-restyle': ['error', { allow: ['layout'] }],
    'shadcn/no-raw-colors': 'error',
    // `2lh` reserves two lines of text so cards in a grid align. It is a CSS
    // unit, not a magic number, and has no equivalent on the spacing scale.
    'shadcn/no-arbitrary-values': ['error', { allow: ['min-h-[2lh]'] }],
    'shadcn/no-inline-styles': 'error',
    'shadcn/no-unknown-classes': 'error',
    'shadcn/require-static-classes': 'error',
  },
  overrides: [
    {
      // Vendored shadcn/base-nova primitives. Their arbitrary values are
      // upstream's; rewriting them would fork us off the `shadcn` CLI.
      files: ['apps/web/src/components/ui/**'],
      rules: {
        'shadcn/no-arbitrary-values': 'off',
      },
    },
    {
      // OG images render through Takumi, not the browser: no Tailwind, no
      // stylesheet, inline styles are the only styling channel.
      files: ['apps/web/src/features/og/**'],
      rules: {
        'shadcn/no-inline-styles': 'off',
      },
    },
    {
      // Decorative viewport-relative artwork (vh/vw sizes, blur radii,
      // squircle radii). None of it maps onto a design token.
      files: ['apps/web/src/components/background-glows.tsx'],
      rules: {
        'shadcn/no-arbitrary-values': 'off',
      },
    },
  ],
})
