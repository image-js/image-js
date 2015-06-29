'use strict';

const kinds = new Map();

export const BINARY = 'BINARY';
kinds.set(BINARY, {
    components: 1,
    alpha: false,
    bitDepth: 1
});

export const GREY8 = 'GREY8';
kinds.set(GREY8, {
    components: 1,
    alpha: false,
    bitDepth: 8
});

export const GREY16 = 'GREY16';
kinds.set(GREY16, {
    components: 1,
    alpha: false,
    bitDepth: 16
});

export const COLOR32 = 'COLOR32';
kinds.set(COLOR32, {
    components: 3,
    alpha: true,
    bitDepth: 8
});

export const COLOR64 = 'COLOR64';
kinds.set(COLOR64, {
    components: 1,
    alpha: true,
    bitDepth: 16
});

export function getKind(kind) {
    return kinds.get(kind);
}

export function getPixelArray(kind, length) {
    // TODO support 16bit and binary
    return new Uint8ClampedArray(length);
}
