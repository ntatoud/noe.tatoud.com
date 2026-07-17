import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import netlify from '@netlify/vite-plugin-tanstack-start'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    devtools(),
    ...(mode !== 'development' ? [netlify()] : []),
    tailwindcss(),
    tanstackStart(),
    viteReact({ include: /\.(tsx|ts|jsx|js)$/ }),
  ],
}))
