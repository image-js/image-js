'use strict';

let Image, ImageData, Canvas, PixelArray;

if (typeof self !== 'undefined') { // Browser
    Image = self.Image;
    ImageData = self.ImageData;
    Canvas = function Canvas(width, height) {
        let canvas = self.document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    };
    PixelArray = function PixelArray(width, height) {
        return new Uint8ClampedArray(width * height * 4);
    };
} else if (typeof module !== 'undefined' && module.exports) { // Node.js
    let canvas = require('canvas');
    Image = canvas.Image;
    ImageData = require('canvas/lib/bindings').ImageData;
    Canvas = canvas;
    PixelArray = function PixelArray(width, height) {
        return new canvas.PixelArray(width, height);
    };
}

export {Image, ImageData, Canvas, PixelArray};
