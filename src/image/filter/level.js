import newArray from 'new-array';

import validateArrayOfChannels from '../utility/validateArrayOfChannels';

export default function level({algorithm = 'full', channels, min, max} = {}) {
    this.checkProcessable('level', {
        bitDepth: [8, 16]
    });

    channels = validateArrayOfChannels(this, {channels:channels});

    switch (algorithm) {

        case 'full':
            processImage(this, this.min, this.max, channels);
            break;

        case 'range':
            if (min === undefined || max === undefined) {
                throw new Error('level: you need to specify min and max values');
            }
            if (min < 0) min = 0;
            if (max > this.maxValue) max = this.maxValue;

            if (!Array.isArray(min)) min = newArray(channels.length, min);
            if (!Array.isArray(max)) max = newArray(channels.length, max);

            processImage(this, min, max, channels);
            break;

        default:
            throw new Error('level: algorithm not implement: ' + algorithm);
    }
}

function processImage(image, min, max, channels) {
    let delta = 1e-5; // sorry no better value that this "best guess"
    let factor = new Array(image.channels);

    for (let c of channels) {
        if (min[c] === 0 && max[c] === image.maxValue) {
            factor[c] = 0;
        } else if (max[c] === min[c]) {
            factor[c] = 0;
        } else {
            factor[c] = (image.maxValue + 1 - delta) / (max[c] - min[c]);
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
            for (let i = 0; i < image.data.length; i += image.channels) {
                image.data[i + c] = Math.min(Math.max(0, ((image.data[i + c] - min[c]) * factor[c] + 0.5) | 0), image.maxValue);
            }
        }
    }
}


