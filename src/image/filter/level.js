import validateArrayOfChannels from '../utility/validateArrayOfChannels';

export default function level({algorithm = 'full', channels} = {}) {
    this.checkProcessable('level', {
        bitDepth: [8, 16]
    });

    channels = validateArrayOfChannels(this, {channels:channels});

    switch (algorithm) {
        case 'full':
            let delta = 1e-5; // sorry no better value that this "best guess"
            let min = this.min;
            let max = this.max;
            let factor = new Array(this.channels);
            for (let c of channels) {
                if (min[c] === 0 && max[c] === this.maxValue) {
                    factor[c] = 0;
                } else if (max[c] === min[c]) {
                    factor[c] = 0;
                } else {
                    factor[c] = (this.maxValue + 1 - delta) / (max[c] - min[c]);
                }
                min[c] += ((0.5 - delta / 2) / factor[c]);
            }

            /*
             Note on border effect
             For 8 bits images we should calculate for the space between -0.5 and 255.5
             so that after ronding the first and last points still have the same population
             But doing this we need to deal with Math.round that gives 256 if the value is 255.5
              */


            for (let j = 0; j < channels.length; j++) {
                let c = channels[j];
                if (factor[c] !== 0) {
                    for (let i = 0; i < this.data.length; i += this.channels) {
                        this.data[i + c] = ((this.data[i + c] - min[c]) * factor[c] + 0.5) | 0;
                    }
                }
            }

            break;
        default:
            throw new Error('level: algorithm not implement: ' + algorithm);
    }
}
