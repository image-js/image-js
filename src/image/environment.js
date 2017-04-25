import Canvas, {Image as DOMImage, ImageData} from 'canvas';
import {readFile, createWriteStream, writeFile} from 'fs';

const env = 'node';

export function isDifferentOrigin() {
    return false;
}

export function fetchBinary(path) {
    return new Promise(function (resolve, reject) {
        readFile(path, function (err, data) {
            if (err) reject(err);
            else resolve(data.buffer);
        });
    });
}

export {env, Canvas, ImageData, DOMImage, createWriteStream, writeFile};
