import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';

export default {
    entry: 'src/index.js',
    format: 'umd',
    dest: 'dist/image.js',
    moduleName: 'IJS',
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
                'node_modules/blob-util/lib/index.js': ['canvasToBlob'],
                'node_modules/color-functions/index.js': ['cssColor']
            }
        }),
        json()
    ]
};
