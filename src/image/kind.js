import * as Kind from './kindNames';
import {RGB, CMYK} from './model/model';

const kinds = {};

kinds[Kind.BINARY] = {
    components: 1,
    alpha: 0,
    bitDepth: 1
};

kinds[Kind.GREYA] = {
    components: 1,
    alpha: 1,
    bitDepth: 8
};

kinds[Kind.GREY] = {
    components: 1,
    alpha: 0,
    bitDepth: 8
};

kinds[Kind.RGBA] = {
    components: 3,
    alpha: 1,
    bitDepth: 8,
    colorModel: RGB
};

kinds[Kind.RGB] = {
    components: 3,
    alpha: 0,
    bitDepth: 8,
    colorModel: RGB
};

kinds[Kind.CMYK] = {
    components: 4,
    alpha: 0,
    bitDepth: 8,
    colorModel: CMYK
};

kinds[Kind.CMYKA] = {
    components: 4,
    alpha: 1,
    bitDepth: 8,
    colorModel: CMYK
};

export function getKind(kind) {
    return kinds[kind];
}

export function getTheoreticalPixelArraySize(image) {
    let length = image.channels * image.size;
    if (image.bitDepth === 1) {
        length = Math.ceil(length / 8);
    }
    return length;
}

export function createPixelArray(image) {
    let length = image.channels * image.size;
    let arr;
    switch (image.bitDepth) {
        case 1:
            arr = new Uint8Array(Math.ceil(length / 8));
            break;
        case 8:
            arr = new Uint8ClampedArray(length);
            break;
        case 16:
            arr = new Uint16Array(length);
            break;
        case 32:
            arr = new Float32Array(length);
            break;
        default:
            throw new Error('Cannot create pixel array for bit depth ' + image.bitDepth);
    }

    // alpha channel is 100% by default
    if (image.alpha) {
        for (let i = image.components; i < arr.length; i += image.channels) {
            arr[i] = image.maxValue;
        }
    }
    image.data = arr;
}
