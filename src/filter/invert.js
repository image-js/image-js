'use strict';

export default function invert() {
    this.checkProcessable("invert",{
        alpha:[1],
        components:[3],
        bitDepth:[8,16]
    });


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
