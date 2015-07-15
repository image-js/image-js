'use strict';

export function getHistogram512({useAlpha=true} = {}) {
    this.checkProcessable("getHistogram512", {
        bitDepth: [8],
        components: 3
    });

    var bitSlots=Math.log(maxSlots)/Math.log(2);
    if (bitSlots != Math.floor(bitSlots)) {
        throw new Error('maxSlots must be a power of 2, for example: '+Math.pow(2, Math.floor(bitSlots)));
    }
    // we will compare the bitSlots to the bitDepth of the image
    // based on this we will shift the values. This allows to generate a histogram
    // of 16 grey even if the images has 256 shade of grey

    var bitShift=0;
    if (this.bitDepth>bitSlots) bitShift=this.bitDepth-bitSlots;

    var data = this.data;
    var result = new Uint32Array(Math.pow(2, Math.min(this.bitDepth, bitSlots)));
    if (useAlpha && this.alpha) {
        let alphaChannelDiff=this.channels-channel-1;

        for (let i = channel; i < data.length; i += this.channels) {
            if (data[i+alphaChannelDiff]>0) { // we add a point in the histogram only if the value is not completely transparent
                result[Math.floor((data[i]>>bitShift)*data[i+alphaChannelDiff]/this.maxValue)]++;
            }
        }
    } else {
        for (let i = channel; i < data.length; i += this.channels) {
            result[data[i]>>bitShift]++;
        }
    }



}



