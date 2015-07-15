'use strict';

let DOMImage, Canvas, getImageData, getCanvasArray;

if (typeof self !== 'undefined') { // Browser

    let ImageData = self.ImageData;

    DOMImage = self.Image;
    Canvas = function Canvas(width, height) {
        let canvas = self.document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    };
    getImageData = function (data, width, height) {
        let validData = data;
        // TODO for now we always copy the array because we don't know if it can be modified after we put it in the canvas
        //if (data.constructor.name !== 'Uint8ClampedArray') {
            validData = new Uint8ClampedArray(data.length);
            for (let i = 0; i < data.length; i++) {
                validData[i] = data[i];
            }
        //}
        return new ImageData(validData, width, height);
    };
    getCanvasArray = function (width, height) {
        return new Uint8ClampedArray(width * height * 4);
    };

} else if (typeof module !== 'undefined' && module.exports) { // Node.js

    let canvas = require('canvas');
    let ImageData = require('canvas/lib/bindings').ImageData;

    DOMImage = canvas.Image;
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
    getCanvasArray = function (width, height) {
        return new canvas.PixelArray(width, height);
    };
}

export {DOMImage, Canvas, getImageData, getCanvasArray};
