'use strict';

export function getHistogram({maxSlots=256} = {}) {
    this.checkProcessable("getHistogram", {
        bitDepth: [8]
    });

    var data = this.data;
    var result = new Uint32Array(Math.pow(2, this.bitDepth));
    for (let i = 0; i < data.length; i += this.channels) {
        result[data[i]]++;
    }
    return result;
}

export function getHistograms({maxSlots=256} = {}) {
    this.checkProcessable("getHistograms", {
        bitDepth: [8]
    });

    var data = this.data;
    var result = new Array(this.channels);
    for (let i = 0; i < this.channels; i++) {
        result[i] = new Uint32Array(Math.pow(2, this.bitDepth));
        for (let j = 0; j < data.length; j += this.channels) {
            result[i][data[j + i]]++;
        }
    }
    return result;
}
