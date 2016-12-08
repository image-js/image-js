import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
debugger;
const jsonConfig = json();

const babelConfig = babel({
    //exclude: 'node_modules/**',
    plugins: [
        'external-helpers'
    ],
    babelrc: false
});

const nodeResolveConfig = nodeResolve({
    module: true,
    jsnext: true,
    main: true,
    browser: true,
    extensions: ['.js', '.json']
});

const commonjsConfig = commonjs({
    namedExports: {
        // rollup-plugin-commonjs v5 has a bug. see https://github.com/rollup/rollup-plugin-commonjs/issues/115
        'node_modules/blob-util/lib/index.js': ['canvasToBlob'],
        'node_modules/color-functions/index.js': ['cssColor']
    }
});

export default {
    entry: 'src/index.js',
    dest: 'dist/image-rollup.js',
    external: ['canvas', 'buffer', 'zlib', 'fs'],
    moduleName: 'IJS',
    plugins: [jsonConfig, babelConfig, nodeResolveConfig, commonjsConfig],
    format: 'umd'
};
