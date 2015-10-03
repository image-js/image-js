import validateArrayOfChannels from '../utility/validateArrayOfChannels';

export default function subtract(value, {channels} = {}) {
    this.checkProcessable('subtract', {
        bitDepth: [8, 16]
    });
    if (value <= 0) throw new Error('subtract: the value must be greater than 0');

    channels = validateArrayOfChannels(this, {channels:channels});

    for (let j = 0; j < channels.length; j++) {
        let c = channels[j];
        for (let i = 0; i < this.data.length; i += this.channels) {
            this.data[i + c] = Math.max(0, (this.data[i + c] - value) >> 0);
        }
    }
}
