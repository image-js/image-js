'use strict';

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'image.js',
        path: __dirname + '/dist',
        library: 'IJS',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    node: {
        Buffer: false,
        process: false
    }
};
