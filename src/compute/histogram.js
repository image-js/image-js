import newArray from 'new-array';

export function getHistogram({maxSlots=256, channel, useAlpha=true} = {}) {
    this.checkProcessable('getHistogram', {
        bitDepth: [8, 16]
    });
    if (channel === undefined) {
        if (this.components > 1) {
            throw new RangeError('You need to define the channel for an image that contains more than one channel');
        }
        channel = 0;
    }
    return getChannelHistogram.call(this, channel, useAlpha, maxSlots);
}

export function getHistograms({maxSlots=256, useAlpha=true} = {}) {
    this.checkProcessable('getHistograms', {
        bitDepth: [8, 16]
    });

    let results = new Array(this.channels);
    for (let i = 0; i < this.channels; i++) {
        results[i] = getChannelHistogram.call(this, i, useAlpha, maxSlots);
    }
    return results;
}


function getChannelHistogram(channel, useAlpha, maxSlots) {
    let bitSlots = Math.log2(maxSlots);
    if (!Number.isInteger(bitSlots)) {
        throw new RangeError('maxSlots must be a power of 2, for example: 64, 256, 1024');
    }
    // we will compare the bitSlots to the bitDepth of the image
    // based on this we will shift the values. This allows to generate a histogram
    // of 16 grey even if the images has 256 shade of grey

    let bitShift = 0;
    if (this.bitDepth > bitSlots) bitShift = this.bitDepth - bitSlots;

    let data = this.data;
    let result = newArray(Math.pow(2, Math.min(this.bitDepth, bitSlots)),0);
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
