import { defineConfig } from 'vitest/config'
import swc from 'unplugin-swc'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname
    }
  },
  plugins: [
    tsconfigPaths(),
    swc.vite(),
  ],
})