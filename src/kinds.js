'use strict';

const kinds = {};

export const BINARY = 'BINARY';
kinds[BINARY] = {
    components: 1,
    alpha: false,
    channels: 1,
    bitDepth: 1
};

export const GREY8 = 'GREY8';
kinds[GREY8] = {
    components: 1,
    alpha: false,
    channels: 1,
    bitDepth: 8,
    maxValue: 0xff
};

export const GREY16 = 'GREY16';
kinds[GREY16] = {
    components: 1,
    alpha: false,
    channels: 1,
    bitDepth: 16,
    maxValue: 0xffff
};

export const COLOR8 = 'COLOR8';
kinds[COLOR8] = {
    components: 3,
    alpha: true,
    channels: 4,
    bitDepth: 8,
    maxValue: 0xff
};

export const COLOR16 = 'COLOR16';
kinds[COLOR16] = {
    components: 3,
    alpha: true,
    channels: 4,
    bitDepth: 16,
    maxValue: 0xffff
};

export function getKind(kind) {
    return kinds[kind];
}

export function getPixelArray(kind, length) {
    var arr;
    switch(kind.bitDepth) {
        case 8:
            arr = new Uint8ClampedArray(length);
            break;
        case 16:
            arr = new Uint16Array(length);
            break;
        default:
            // TODO binary
            throw new Error('Cannot create pixel array for bit depth ' + kind.bitDepth);
    }

    // alpha channel is 100% by default
    if (kind.alpha) {
        for (var i = kind.components; i < arr.length; i += kind.channels) {
            arr[i] = kind.maxValue;
        }
    }

    return arr;
}
