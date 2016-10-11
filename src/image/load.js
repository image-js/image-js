import Image from './image';
import Stack from '../stack/stack';
import {loadBinary, DOMImage, Canvas, isDifferentOrigin} from './environment';
import {PNGDecoder} from 'fast-png';
import {decode as decodeJpeg} from 'fast-jpeg';
import {decode as decodeTiff} from 'tiff';
import atob from 'atob-lite';
import imageType from 'image-type';

const isDataURL = /^data:[a-z]+\/([a-z]+);base64,/;

function str2ab(str) {
    const arr = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
        arr[i] = str.charCodeAt(i);
    }
    return arr;
}

function swap16(val) {
    return ((val & 0xFF) << 8) | ((val >> 8) & 0xFF);
}

export function loadURL(url, options) {
    const dataURL = url.slice(0, 64).match(isDataURL);
    let binaryDataP;
    if (dataURL) {
        binaryDataP = Promise.resolve(str2ab(atob(url.slice(dataURL[0].length))));
    } else {
        binaryDataP = loadBinary(url, options);
    }
    return binaryDataP.then(function (binaryData) {
        const uint8 = new Uint8Array(binaryData);
        const type = imageType(uint8);
        if (type) {
            switch (type.ext) {
                case 'png':
                    return loadPNG(binaryData);
                case 'jpg': {
                    const decoded = decodeJpeg(binaryData);
                    let meta;
                    if (decoded.exif) {
                        meta = getMetadata(decoded.exif);
                    }
                    return loadGeneric(url, {meta});
                }
                case 'tif':
                    return loadTIFF(binaryData);
            }
        }
        return loadGeneric(url);
    });
}

function loadPNG(data) {
    const decoder = new PNGDecoder(data);
    const png = decoder.decode();
    const bitDepth = png.bitDepth;
    const buffer = png.data.buffer;
    let bitmap;
    if (bitDepth === 8) {
        bitmap = new Uint8ClampedArray(buffer);
    } else if (bitDepth === 16) {
        bitmap = new Uint16Array(buffer);
        for (let i = 0; i < bitmap.length; i++) {
            bitmap[i] = swap16(bitmap[i]);
        }
    }

    const type = png.colourType;
    let components, alpha = 0;
    switch (type) {
        case 0: components = 1; break;
        case 2: components = 3; break;
        case 4: components = 1; alpha = 1; break;
        case 6: components = 3; alpha = 1; break;
    }

    return new Image(png.width, png.height, bitmap, {components, alpha, bitDepth});
}

function loadTIFF(data) {
    let result = decodeTiff(data);
    if (result.length === 1) {
        return getImageFromIFD(result[0]);
    } else {
        return new Stack(result.map(getImageFromIFD));
    }
}

function getMetadata(image) {
    const metadata = {
        tiff: image
    };
    if (image.exif) {
        metadata.exif = image.exif;
    }
    if (image.gps) {
        metadata.gps = image.gps;
    }
    return metadata;
}

function getImageFromIFD(image) {
    return new Image(image.width, image.height, image.data, {
        components: 1,
        alpha: 0,
        colorModel: null,
        bitDepth: image.bitsPerSample,
        meta: getMetadata(image)
    });
}

function loadGeneric(url, options) {
    options = options || {};
    return new Promise(function (resolve, reject) {
        let image = new DOMImage();

        if (isDifferentOrigin(url)) {
            // see https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
            image.crossOrigin = 'Anonymous';
        }

        image.onload = function () {
            let w = image.width, h = image.height;
            let canvas = new Canvas(w, h);
            let ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, w, h);
            let data = ctx.getImageData(0, 0, w, h).data;
            resolve(new Image(w, h, data, options));
        };
        image.onerror = function () {
            reject(new Error('Could not load ' + url));
        };
        image.src = url;
    });
}
