const env = 'browser';
const ImageData = self.ImageData;
const DOMImage = self.Image;

const origin = self.location.origin;
export function isDifferentOrigin(url) {
    try {
        let parsedURL = new URL(url);
        return parsedURL.origin !== origin;
    } catch (e) {
        // may be a relative URL. In this case, it cannot be parsed but is effectively from same origin
        return false;
    }
}

export function Canvas(width, height) {
    let canvas = self.document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

export function fetchBinary(url, {withCredentials = false} = {}) {
    return new Promise(function (resolve, reject) {
        let xhr = new self.XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.withCredentials = withCredentials;

        xhr.onload = function (e) {
            if (this.status !== 200) reject(e);
            else resolve(this.response);
        };
        xhr.onerror = reject;
        xhr.send();
    });
}

export function createWriteStream() {
    throw new Error('createWriteStream does not exist in the browser');
}

export function writeFile() {
    throw new Error('writeFile does not exist in the browser');
}

export {env, ImageData, DOMImage};
