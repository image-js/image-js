'use strict';

export default function invert() {
    this.checkProcessable("invert",{
        bitDepth:[8,16]
    });


    invert3Components(this);
};

function invert3Components(image) {
    var data = image.data;
    for (let i = 0; i < data.length; i += image.channels) {
        for (let j=0; j<image.components; j++) {
            data[i+j] = image.maxValue - data[i+j];
        }
    }
}
