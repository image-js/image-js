import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

const config = {
  input: 'packages/image-js/lib-esm/index.js',
  output: {
    exports: 'named',
    file: 'dist/image.js',
    format: 'umd',
    name: 'IJS'
  },
  plugins: [
    resolve({
      module: true,
      main: true,
      browser: true,
      extensions: ['.js']
    }),
    commonjs({
      namedExports: {
        'packages/image-js/node_modules/pako/index.js': ['Inflate', 'deflate'],
        'packages/image-js/node_modules/utf8/utf8.js': ['decode', 'encode']
      }
    })
  ]
};

export default config;
