'use strict';

export default function invert() {
    this.checkProcessable("invert",{
        bitDepth:[8,16]
    });


    var data = this.data;
    for (let i = 0; i < data.length; i += this.channels) {
        for (let j=0; j<this.components; j++) {
            data[i+j] = this.maxValue - data[i+j];
        }
    }

};

