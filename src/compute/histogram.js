'use strict';

export function getHistogram({channel=0, useAlpha=true} = {}) {
    this.checkProcessable("getHistogram", {
        bitDepth: [8]
    });

    return getChannelHistogram.call(this, channel, useAlpha);
}

export function getHistograms({useAlpha=true} = {}) {
    this.checkProcessable("getHistograms", {
        bitDepth: [8]
    });

    var results = new Array(this.channels);
    for (let i = 0; i < this.channels; i++) {
        results[i] = getChannelHistogram.call(this, i, useAlpha);
    }
    return results;
}



function getChannelHistogram(channel, useAlpha) {
    var data = this.data;
    var result = new Uint32Array(Math.pow(2, this.bitDepth));
    if (useAlpha && this.alpha) {
        let alphaChannelDiff=this.channels-channel-1;

        for (let i = channel; i < data.length; i += this.channels) {
            if (data[i+alphaChannelDiff]>0) { // we add a point in the histogram only if the value is not completely transparent
                result[Math.floor(data[i]*data[i+alphaChannelDiff]/this.maxValue)]++;
            }
        }
    } else {
        for (let i = channel; i < data.length; i += this.channels) {
            result[data[i]]++;
        }
    }

    return result;
}
