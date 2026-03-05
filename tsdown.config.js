import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.js'],
  format: ['esm'],
  target: 'node22',
  clean: true,
  sourcemap: true,
  outDir: 'dist'
});
