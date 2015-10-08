import Image from '../../image';

import huang from './huang';
import intermodes from './intermodes';
import isodata from './isodata';
import li from './li';
import maxEntropy from './maxEntropy';
import mean from './mean';
import minError from './minError';
import otsu from './otsu';
import percentile from './percentile';
import renyiEntropy from './renyiEntropy.js';
import shanbhag from  './shanbhag';
import triangle from './triangle';
import yen from './yen';
import minimum from './minimum';
import {getThreshold} from '../../../util/converter';

/*
 Creation of binary mask is based on the determination of a threshold
 You may either choose among the provided algorithm or just specify a threshold value
 */


export default function mask({
    algorithm = 'threshold',
    threshold = 0.5,
    useAlpha = true,
    invert = false
    } = {}) {

    this.checkProcessable('mask', {
        components: 1,
        bitDepth: [8,16]
    });

    let histogram = this.getHistogram();
    switch (algorithm.toLowerCase()) {
        case 'threshold':
            threshold = getThreshold(threshold, this.maxValue);
            break;
        case 'huang':
            threshold = huang(histogram);
            break;
        case 'intermodes':
            threshold = intermodes(histogram);
            break;
        case 'isodata':
            threshold = isodata(histogram);
            break;
        case 'li':
            threshold = li(histogram, this.size);
            break;
        case 'maxentropy':
            threshold = maxEntropy(histogram, this.size);
            break;
        case 'mean':
            threshold = mean(histogram, this.size);
            break;
        case 'minerror':
            threshold = minError(histogram, this.size);
            break;
        case 'otsu':
            threshold = otsu(histogram, this.size);
            break;
        case 'percentile':
            threshold = percentile(histogram);
            break;
        case 'renyientropy':
            threshold = renyiEntropy(histogram, this.size);
            break;
        case 'shanbhag':
            threshold = shanbhag(histogram, this.size);
            break;
        case 'triangle':
            threshold = triangle(histogram);
            break;
        case 'yen':
            threshold = yen(histogram, this.size);
            break;
        case 'minimum':
            threshold = minimum(histogram, this.size);
            break;
        default:
            throw new Error('mask transform unknown algorithm: ' + algorithm);
    }

    let newImage = new Image (this.width, this.height, {
        kind: 'BINARY',
        parent: this
    });

    let ptr = 0;
    if (this.alpha && useAlpha) {
        for (let i = 0; i < this.data.length; i += this.channels) {
            let value = this.data[i] + (this.maxValue - this.data[i]) * (this.maxValue - this.data[i + 1]) / this.maxValue;
            if ((invert && value <= threshold) || (!invert && value >= threshold)) {
                newImage.setBit(ptr);
            }
            ptr++;
        }
    } else {
        for (let i = 0; i < this.data.length; i += this.channels) {
            if ((invert && this.data[i] <= threshold) || (!invert && this.data[i] >= threshold)) {
                newImage.setBit(ptr);
            }
            ptr++;
        }
    }
    return newImage;
}
