import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json'; // Import the JSON plugin
import { babel } from '@rollup/plugin-babel';

export default {
  input: 'src/server.js', // Adjust the entry file path
  output: {
    file: 'dist/bundle.js', // Adjust the output file path
    format: 'cjs', // CommonJS format for Node.js
    exports: 'auto', // Preserve ESM exports in CommonJS format
  },
  plugins: [
    resolve({
      preferBuiltins: false,
    }),
    commonjs(),
    json(), // Include the JSON plugin
    babel({
      extensions: ['.js', '.mjs'],
      babelHelpers: 'bundled',
      include: ['src/**/*'],
    }),
  ],
  external: [],
};
