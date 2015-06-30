'use strict';

export default function invert() {
    // TODO support other types
    if (this.components !== 3) {
        throw new TypeError('Invert is only implemented for 3 components images');
    }
    invert3Components(this);
};

function invert3Components(image) {
    var data = image.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = image.maxValue - data[i];
        data[i + 1] = image.maxValue - data[i + 1];
        data[i + 2] = image.maxValue - data[i + 2];
    }
}
