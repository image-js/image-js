import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/index.js',
    output: {
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
                'node_modules/blob-util/lib/index.js': ['canvasToBlob'],
                'node_modules/color-functions/index.js': ['cssColor'],
                'node_modules/jpeg-js/index.js': ['decode', 'encode'],
                'node_modules/ml-matrix-convolution/src/index.js': [
                    'direct',
                    'fft'
                ],
                'node_modules/ml-array-utils/src/index.js': ['scale'],
                'node_modules/pako/index.js': [
                    'inflate',
                    'Inflate',
                    'deflate',
                    'Deflate'
                ]
            }
        }),
        json()
    ]
};
