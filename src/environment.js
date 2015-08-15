let DOMImage, Canvas, getImageData, getCanvasArray, isDifferentOrigin, env;

if (typeof self !== 'undefined') { // Browser

    env = 'browser';
    let origin = self.location.origin;
    isDifferentOrigin = function (url) {
        try {
            let parsedURL = new self.URL(url);
            return parsedURL.origin !== origin;
        } catch (e) {
            // may be a relative URL. In this case, it cannot be parsed but is effectively from same origin
            return false;
        }
    };

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

    env = 'node';
    isDifferentOrigin = function (url) {
        return false;
    };

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

export {DOMImage, Canvas, getImageData, getCanvasArray, isDifferentOrigin, env};
