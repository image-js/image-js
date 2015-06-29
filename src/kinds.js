'use strict';

const kinds = {};

export const BINARY = 'BINARY';
kinds[BINARY] = {
    components: 1,
    alpha: false,
    bitDepth: 1
};

export const GREY8 = 'GREY8';
kinds[GREY8] = {
    components: 1,
    alpha: false,
    bitDepth: 8
};

export const GREY16 = 'GREY16';
kinds[GREY16] = {
    components: 1,
    alpha: false,
    bitDepth: 16
};

export const COLOR32 = 'COLOR32';
kinds[COLOR32] = {
    components: 3,
    alpha: true,
    bitDepth: 8
};

export const COLOR64 = 'COLOR64';
kinds[COLOR64] = {
    components: 1,
    alpha: true,
    bitDepth: 16
};

export function getKind(kind) {
    return kinds[kind];
}

export function getPixelArray(kind, length) {
    // TODO support 16bit and binary
    var arr = new Uint8ClampedArray(length);

    // alpha channel is 100% by default
    for (var i = 3; i < arr.length; i += 4) {
        arr[i] = 255;
    }

    return arr;
}
