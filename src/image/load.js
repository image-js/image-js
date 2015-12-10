import Image from './image';
import Stack from '../stack/stack';
import {env, loadBinary, DOMImage, ImageData, Canvas, isDifferentOrigin} from './environment';
import {PNGDecoder} from 'fast-png';
import {TIFFDecoder} from 'tiff';
import atob from 'atob-lite';

const isDataURL = /^data:[a-z]+\/([a-z]+);base64,/;
const isPNG = /\.png$/i;
const isTIFF = /\.tiff?$/i;

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

export function loadURL(url) {
    const dataURL = url.slice(0, 64).match(isDataURL);
    if (dataURL) {
        const mimetype = dataURL[1];
        const offset = dataURL[0].length;
        if (mimetype === 'png') {
            let slice = url.slice(offset);
            return Promise.resolve(str2ab(atob(slice))).then(loadPNG);
        } else if (mimetype === 'tiff') {
            let slice = url.slice(offset);
            return Promise.resolve(str2ab(atob(slice))).then(loadTIFF);
        }
    }

    if (isPNG.test(url)) {
        return loadBinary(url).then(loadPNG);
    } else if (isTIFF.test(url)) {
        return loadBinary(url).then(loadTIFF);
    }

    return loadGeneric(url);
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
    let decoder = new TIFFDecoder(data);
    let result = decoder.decode();
    if (result.length === 1) {
        return getImageFromIFD(result.ifd[0]);
    } else {
        return new Stack(result.ifd.map(getImageFromIFD));
    }
}

function getImageFromIFD(image) {
    return new Image(image.width, image.height, image.data, {
        components: 1,
        alpha: 0,
        colorModel: null,
        bitDepth: image.bitsPerSample
    });
}

function loadGeneric(url) {
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
            resolve(new Image(w, h, data));
        };
        image.onerror = function () {
            reject(new Error('Could not load ' + url));
        };
        image.src = url;
    });
}
