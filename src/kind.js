import * as KindNames from './kindNames';
import {RGB} from './model/model';

const kinds = {};

kinds[KindNames.BINARY] = {
    components: 1,
    alpha: 0,
    bitDepth: 1
};

kinds[KindNames.GREYA] = {
    components: 1,
    alpha: 1,
    bitDepth: 8
};

kinds[KindNames.RGBA] = {
    components: 3,
    alpha: 1,
    bitDepth: 8,
    colorModel: RGB
};

export function getKind(kind) {
    return kinds[kind];
}

export function getPixelArraySize(kind, numberPixels) {
    let length = (kind.components + kind.alpha) * numberPixels;
    if (kind.bitDepth === 1) {
        length = Math.ceil(length / 8);
    }
    return length;
}

export function getPixelArray(kind, numberPixels) {
    let length = (kind.components + kind.alpha) * numberPixels;
    let arr;
    switch (kind.bitDepth) {
        case 1:
            arr = new Uint8Array(Math.ceil(length / 8));
            break;
        case 8:
            arr = new Uint8ClampedArray(length);
            break;
        case 16:
            arr = new Uint16Array(length);
            break;
        default:
            throw new Error('Cannot create pixel array for bit depth ' + kind.bitDepth);
    }

    // alpha channel is 100% by default
    if (kind.alpha) {
        for (let i = kind.components; i < arr.length; i += kind.channels) {
            arr[i] = kind.maxValue;
        }
    }

    return arr;
}
