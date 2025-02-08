import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/tailwind.ts',
    'src/eslint.ts',
    'src/prettier.ts'
  ],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['tailwindcss'],
  treeshake: true,
  sourcemap: true
}) 