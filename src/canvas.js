'use strict';

let Image, Canvas, getImageData;

if (typeof self !== 'undefined') { // Browser

    let ImageData = self.ImageData;

    Image = self.Image;
    Canvas = function Canvas(width, height) {
        let canvas = self.document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    };
    getImageData = function (data, width, height) {
        let validData = data;
        if (data.constructor.name !== 'Uint8ClampedArray') {
            validData = new Uint8ClampedArray(data.length);
            for (let i = 0; i < data.length; i++) {
                validData[i] = data[i];
            }
        }
        return new ImageData(validData, width, height);
    };

} else if (typeof module !== 'undefined' && module.exports) { // Node.js

    let canvas = require('canvas');
    let ImageData = require('canvas/lib/bindings').ImageData;

    Image = canvas.Image;
    Canvas = canvas;
    getImageData = function (data, width, height) {
        let validData = data;
        if (!(data instanceof canvas.PixelArray)) {
            validData = new canvas.PixelArray(width, height);
            for (let i = 0; i < data.length; i++) {
                validData[i] = data[i];
            }
        }
        return new ImageData(validData, width, height);
    };

}

export {Image, Canvas, getImageData};
