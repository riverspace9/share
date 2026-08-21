import { fileURLToPath } from 'node:url'

import { compile } from '@mdx-js/mdx'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    {
      name: 'mdx',
      enforce: 'pre',
      async transform(source, id) {
        if (!id.split('?')[0].endsWith('.mdx')) {
          return undefined
        }

        const compiled = await compile(source, {
          providerImportSource: '@mdx-js/react',
        })

        return {
          code: String(compiled),
          map: null,
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
})
