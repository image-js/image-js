let createCanvas, DOMImage, ImageData;
try {
    const canvas = require('canvas');
    createCanvas = canvas.createCanvas;
    DOMImage = canvas.Image;
    ImageData = canvas.ImageData;
} catch (e) {
    // eslint-disable-next-line no-console
    console.error('image-js could not load the canvas library. Some methods may not work.');
    createCanvas = function () {
        throw new Error('createCanvas requires the canvas library');
    };
    DOMImage = function () {
        throw new Error('DOMImage requires the canvas library');
    };
    ImageData = function () {
        throw new Error('ImageData requires the canvas library');
    };
}

import {readFile, createWriteStream, writeFile} from 'fs';

const env = 'node';

export function fetchBinary(path) {
    return new Promise(function (resolve, reject) {
        readFile(path, function (err, data) {
            if (err) reject(err);
            else resolve(data.buffer);
        });
    });
}

export {env, createCanvas, ImageData, DOMImage, createWriteStream, writeFile};
