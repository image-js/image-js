import {validateArrayOfChannels} from '../../util/channel';
import Image from '../image';
import {checkNumberArray} from '../../util/value';

export default function add(value, {channels} = {}) {
    this.checkProcessable('add', {
        bitDepth: [8, 16]
    });

    channels = validateArrayOfChannels(this, {channels:channels});
    value = checkNumberArray(value);

// we allow 3 cases, the value may be an array (1D), an image or a single value
    if (!isNaN(value)) {
        for (let j = 0; j < channels.length; j++) {
            let c = channels[j];
            for (let i = 0; i < this.data.length; i += this.channels) {
                this.data[i + c] = Math.min(this.maxValue, (this.data[i + c] + value) >> 0);
            }
        }
    } else {
        if (this.data.length !== value.length) {
            throw new Error('add: the data size is different');
        }
        for (let j = 0; j < channels.length; j++) {
            let c = channels[j];
            for (let i = 0; i < this.data.length; i += this.channels) {
                this.data[i + c] = Math.max(0,Math.min(this.maxValue, (this.data[i + c] + value[i + c]) >> 0));
            }
        }
    }
}
