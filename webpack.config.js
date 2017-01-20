'use strict';

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'image.js',
        path: './dist',
        library: 'IJS',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            }
        ]
    },
    node: {
        Buffer: false,
        process: false
    }
};
