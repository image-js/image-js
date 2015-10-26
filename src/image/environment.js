let loadBinary, DOMImage, Canvas, ImageData, isDifferentOrigin, env;

if (typeof self !== 'undefined') { // Browser
    env = 'browser';
    const origin = self.location.origin;
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

    loadBinary = function (url) {
        return new Promise(function (resolve, reject) {
            let xhr = new self.XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';

            xhr.onload = function (e) {
                this.status === 200 ? resolve(this.response) : reject('wrong status', e);
            };
            xhr.onerror = reject;
            xhr.send();
        });
    };
} else if (typeof module !== 'undefined' && module.exports) { // Node.js
    env = 'node';
    isDifferentOrigin = function (url) {
        return false;
    };

    const canvas = require('canvas');
    DOMImage = canvas.Image;
    Canvas = canvas;
    ImageData = canvas.ImageData;

    const fs = require('fs');
    loadBinary = function (path) {
        return new Promise(function (resolve, reject) {
            fs.readFile(path, function (err, data) {
                err ? reject(err) : resolve(data.buffer);
            });
        });
    };
}

export {loadBinary, DOMImage, Canvas, ImageData, isDifferentOrigin, env};
