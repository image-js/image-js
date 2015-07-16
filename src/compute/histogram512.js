'use strict';

export function getHistogram512({useAlpha=true} = {}) {
    this.checkProcessable("getHistogram512", {
        bitDepth: [8,16],
        components: [3]
    });

    var bitShift=bitDepth-3;

    var data = this.data;
    var result = new Float32Array(512);
    if (useAlpha && this.alpha) {
        for (let i = 0; i < data.length; i += this.channels) {
                let slot=((data[i])>>bitShift)*64+
                    ((data[i+1])>>bitShift)*8+
                    ((data[i+2])>>bitShift);
                result[slot]+=data[i+this.channels-1]/this.maxValue;
        }
    } else {
        for (let i = 0; i < data.length; i += this.channels) {
            let slot=(data[i]>>bitShift)*64+(data[i+1]>>bitShift)*8+(data[i+2]>>bitShift);
            result[slot]++;
        }
    }
}



