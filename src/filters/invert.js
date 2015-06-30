'use strict';

export default function invert() {
    // TODO support other types
    invertRGBA(this.data);
};

export function invertRGBA(data) {
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }
}
