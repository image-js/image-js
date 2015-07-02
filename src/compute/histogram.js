'use strict';

export function getHistogram({maxSlot=256} = {}) {
    this.checkProcessable("getHistogram",{
        bitDepth:[8]
    });

    var result=new Array(Math.pow(2,this.bitDepth));
    for (let j=0; j<data.length; j+=this.channels) {
        result[data[i]]++;
    }
    return result;
};

export function getHistograms({maxSlot=256} = {}) {
    this.checkProcessable("getHistograms",{
        bitDepth:[8]
    });

    var result=new Array(this.channels);
    for (let i=0; i<channels.length; i++) {
        result[i]=new Array(Math.pow(2,this.bitDepth));
        for (let j=0; j<data.length; j+=this.channels) {
            result[i][data[j]]++;
        }
    }
    return result;
};

