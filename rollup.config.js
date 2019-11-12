import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

function getBaseConfig() {
  return {
    input: 'src/index.js',
    output: {
      exports: 'named',
      file: 'dist/image.js',
      format: 'umd',
      name: 'IJS',
      sourcemap: true
    },
    plugins: [
      babel(),
      resolve({
        module: true,
        main: true,
        browser: true,
        extensions: ['.js', '.json']
      }),
      commonjs({
        namedExports: {
          'node_modules/pako/index.js': ['Inflate', 'deflate'],
          'node_modules/tiff/node_modules/utf8/utf8.js': ['decode', 'encode']
        }
      }),
      json()
    ]
  };
}

const main = getBaseConfig();
const minified = getBaseConfig();

minified.output.file = 'dist/image.min.js';
minified.plugins.push(terser());

const config = [main, minified];

export default config;
