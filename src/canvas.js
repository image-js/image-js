'use strict';

let Image, ImageData, Canvas;

if (typeof self !== 'undefined') { // Browser
    Image = self.Image;
    ImageData = self.ImageData;
    Canvas = function Canvas(width, height) {
        let canvas = self.document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    };
} else if (typeof module !== 'undefined' && module.exports) { // Node.js
    let canvas = require('canvas');
    Image = canvas.Image;
    ImageData = require('canvas/lib/bindings').ImageData;
    Canvas = canvas;
}

export {Image, ImageData, Canvas};
