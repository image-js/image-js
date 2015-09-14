let DOMImage, Canvas, ImageData, isDifferentOrigin, env;

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

    ImageData = self.ImageData;

    DOMImage = self.Image;
    Canvas = function Canvas(width, height) {
        let canvas = self.document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    };
} else if (typeof module !== 'undefined' && module.exports) { // Node.js
    env = 'node';
    isDifferentOrigin = function (url) {
        return false;
    };

    ImageData = require('canvas/lib/bindings').ImageData;

    let canvas = require('canvas');
    DOMImage = canvas.Image;
    Canvas = canvas;
}

export {DOMImage, Canvas, ImageData, isDifferentOrigin, env};
