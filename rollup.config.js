import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';

const config = {
  input: 'src/index.js',
  output: {
    exports: 'named',
    file: 'dist/image.js',
    format: 'umd',
    name: 'IJS'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve({
      module: true,
      main: true,
      browser: true,
      extensions: ['.js', '.json']
    }),
    commonjs({
      namedExports: {
        'node_modules/pako/index.js': ['Inflate', 'deflate'],
        'node_modules/utf8/utf8.js': ['decode', 'encode']
      }
    }),
    json()
  ]
};

export default config;
