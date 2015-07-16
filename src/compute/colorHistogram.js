'use strict';

export function getColorHistogram({useAlpha=true, nbSlots=512} = {}) {
    this.checkProcessable("getHistogram512", {
        bitDepth: [8,16],
        components: [3]
    });

    let nbSlotsCheck=Math.log(nbSlots)/Math.log(8);
    if (nbSlotsCheck != Math.floor(nbSlotsCheck)) {
        throw new Error('nbSlots must be a power of 8. Usually 8, 64, 512 or 4096');
    }

    let bitShift=bitDepth-nbSlotsCheck;

    let data = this.data;
    let result = new Float32Array(Math.pow(8, nbSlotsCheck));
    let factor2=Math.pow(2,nbSlotsCheck*2);
    let factor1=Math.pow(2,nbSlotsCheck);

    if (useAlpha && this.alpha) {
        for (let i = 0; i < data.length; i += this.channels) {
                let slot=((data[i])>>bitShift)*factor2+
                    ((data[i+1])>>bitShift)*factor1+
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



