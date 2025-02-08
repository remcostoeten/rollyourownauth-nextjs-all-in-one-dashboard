import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.tsx', 'src/**/*.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react'],
  inject: ['./react-import.js'],
}) 