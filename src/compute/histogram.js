'use strict';

export default function getHistogram({maxSlot=256} = {}) {
    this.checkProcessable("getHistogram",{
        bitDepth:[8]
    });

    var data=this.data;
    var result=new Uint32Array(Math.pow(2,this.bitDepth));
    for (let i=0; i<data.length; i+=this.channels) {
        result[data[i]]++;
    }
    return result;
};

