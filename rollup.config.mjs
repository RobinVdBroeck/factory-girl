import del from 'rollup-plugin-delete';
import pkg from './package.json' with { type: 'json' };

const config = {
  input: 'src/index.js',
  external: Object.keys(pkg.dependencies),
  plugins: [del({ targets: 'dist/*' })],
  output: [
    {
      file: 'dist/index.mjs',
      format: 'es',
      sourcemap: true,
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
    },
  ],
};

export default config;
