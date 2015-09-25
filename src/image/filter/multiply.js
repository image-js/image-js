import validateArrayOfChannels from '../utility/validateArrayOfChannels';

export default function add(value, {channels} = {}) {
    this.checkProcessable('multiply', {
        bitDepth: [8, 16]
    });
    if (value <= 0) throw new Error('multiply: the value must be greater than 0');

    channels = validateArrayOfChannels(this, {channels:channels});

    for (let j = 0; j < channels.length; j++) {
        let c = channels[j];
        for (let i = 0; i < this.data.length; i += this.channels) {
            this.data[i + c] = Math.min(this.maxValue, (this.data[i + c] * value) >> 0);
        }
    }
}
