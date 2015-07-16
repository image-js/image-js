'use strict';

export function getHistogram({maxSlots=256, channel=undefined, useAlpha=true} = {}) {
    this.checkProcessable("getHistogram", {
        bitDepth: [8, 16]
    });
    if (channel === undefined) {
        if (this.components > 1) {
            throw new Error('You need to define the channel for an image that contains more than one channel');
        }
        channel = 0;
    }
    return getChannelHistogram.call(this, channel, useAlpha, maxSlots);
}

export function getHistograms({maxSlots=256, useAlpha=true} = {}) {
    this.checkProcessable("getHistograms", {
        bitDepth: [8, 16]
    });

    let results = new Array(this.channels);
    for (let i = 0; i < this.channels; i++) {
        results[i] = getChannelHistogram.call(this, i, useAlpha);
    }
    return results;
}


function getChannelHistogram(channel, useAlpha, maxSlots) {
    let bitSlots = Math.log(maxSlots) / Math.log(2);
    if (bitSlots != Math.floor(bitSlots)) {
        throw new Error('maxSlots must be a power of 2, for example: 64, 256, 1024');
    }
    // we will compare the bitSlots to the bitDepth of the image
    // based on this we will shift the values. This allows to generate a histogram
    // of 16 grey even if the images has 256 shade of grey

    let bitShift = 0;
    if (this.bitDepth > bitSlots) bitShift = this.bitDepth - bitSlots;

    var data = this.data;
    var result = new Float32Array(Math.pow(2, Math.min(this.bitDepth, bitSlots)));
    if (useAlpha && this.alpha) {
        let alphaChannelDiff = this.channels - channel - 1;

        for (let i = channel; i < data.length; i += this.channels) {
            result[data[i] >> bitShift] += data[i + alphaChannelDiff] / this.maxValue;
        }
    } else {
        for (let i = channel; i < data.length; i += this.channels) {
            result[data[i] >> bitShift]++;
        }
    }

    return result;
}
