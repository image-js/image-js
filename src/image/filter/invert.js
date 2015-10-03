// we try the faster methods

import {validateArrayOfChannels} from '../../util/channel';

export default function invert({channels} = {}) {
    this.checkProcessable('invertOneLoop', {
        bitDepth: [1, 8, 16]
    });

    if (this.bitDepth === 1) {
        // we simply invert all the integers value
        // there could be a small mistake if the number of points
        // is not a multiple of 8 but it is not important
        let data = this.data;
        for (let i = 0; i < data.length; i++) {
            data[i] = ~data[i];
        }
    } else {
        let channels = validateArrayOfChannels(this, channels, true);

        let data = this.data;

        // for (let j of channels) { WOULD SLOW DO OF A FACTOR 10 !

        for (let c = 0; c < channels.length; c++) {
            let j = channels[c];
            for (let i = j; i < data.length; i += this.channels) {
                data[i] = this.maxValue - data[i];
            }
        }
    }
}
