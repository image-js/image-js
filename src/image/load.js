import Image from './Image';
import Stack from '../stack/Stack';
import {fetchBinary, DOMImage, Canvas, isDifferentOrigin} from './environment';
import {decode as decodePng} from 'fast-png';
import {decode as decodeJpeg} from 'fast-jpeg';
import {decode as decodeTiff} from 'tiff';
import imageType from 'image-type';
import {decode as base64Decode} from '../util/base64';

const isDataURL = /^data:[a-z]+\/([a-z]+);base64,/;

export function loadImage(image, options) {
    if (typeof image === 'string') {
        return loadURL(image, options);
    } else if (image instanceof ArrayBuffer) {
        return Promise.resolve(loadBinary(new Uint8Array(image), options));
    } else if (image.buffer) {
        return Promise.resolve(loadBinary(image, options));
    } else {
        throw new Error('argument to "load" must be a string or buffer.');
    }
}

function loadBinary(image, options, url) {
    const type = imageType(image);
    if (type) {
        switch (type.ext) {
            case 'png':
                return loadPNG(image);
            case 'jpg': {
                const decoded = decodeJpeg(image);
                let meta;
                if (decoded.exif) {
                    meta = getMetadata(decoded.exif);
                }
                return loadFromURL(url, {meta});
            }
            case 'tif':
                return loadTIFF(image);
            // no default
        }
    }
    return loadFromURL(url);

    function loadFromURL(url, options) {
        if (!url) {
            throw new Error(`This kind of image (${type}) can only be loaded from URL.`);
        }
        return loadGeneric(url, options);
    }
}

function loadURL(url, options) {
    const dataURL = url.slice(0, 64).match(isDataURL);
    let binaryDataP;
    if (dataURL) {
        binaryDataP = Promise.resolve(base64Decode(url.slice(dataURL[0].length)));
    } else {
        binaryDataP = fetchBinary(url, options);
    }
    return binaryDataP.then((binaryData) => {
        const uint8 = new Uint8Array(binaryData);
        return loadBinary(uint8, options, url);
    });
}

function loadPNG(data) {
    const png = decodePng(data);
    const bitDepth = png.bitDepth;
    let bitmap = png.data;
    if (bitDepth === 8) {
        bitmap = new Uint8ClampedArray(png.data.buffer, png.data.byteOffset, png.data.byteLength);
    }

    const type = png.colourType;
    let components;
    let alpha = 0;
    switch (type) {
        case 0: components = 1; break;
        case 2: components = 3; break;
        case 4: components = 1; alpha = 1; break;
        case 6: components = 3; alpha = 1; break;
        default: throw new Error(`Unexpected colourType: ${type}`);
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
        bitDepth: image.bitsPerSample.length ? image.bitsPerSample[0] : image.bitsPerSample,
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
            let w = image.width;
            let h = image.height;
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
