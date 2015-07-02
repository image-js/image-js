'use strict';

export default function getHistograms({maxSlot=256} = {}) {
    this.checkProcessable("getHistograms",{
        bitDepth:[8]
    });

    var data=this.data;
    var result=new Array(this.channels);
    for (let i=0; i<this.channels; i++) {
        result[i]=new Uint32Array(Math.pow(2,this.bitDepth));
        for (let j=0; j<data.length; j+=this.channels) {
            result[i][data[j+i]]++;
        }
    }
    return result;
};

