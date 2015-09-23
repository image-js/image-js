import Image from '../../image';

import percentile from './percentile';


/*
 Creation of binary mask is based on the determination of a threshold
 You may either choose among the provided algorithm or just specify a threshold value
 If the algorithm is a number, it is the threshold value
 */


export default function mask({
    algorithm = 0.5,
    useAlpha = true,
    invert = false
    } = {}) {
    this.checkProcessable('mask', {
        components: 1,
        bitDepth: [8]
    });

    let threshold = 0;

    if (typeof algorithm === 'number') {
        threshold = algorithm * this.maxValue;
    } else {
        let histogram = this.getHistogram();
        switch (algorithm.toLowerCase()) {
            case 'percentile':
                threshold = percentile(histogram);
                break;
            default:
                throw new Error('mask transform unknown algorithm: ' + algorithm);
        }
    }

    let newImage = new Image (this.width, this.height, {
        kind: 'BINARY',
        parent: this
    });

    let ptr = 0;
    if (this.alpha && useAlpha) {
        for (let i = 0; i < this.data.length; i += this.channels) {
            let value=this.data[i] + (this.maxValue - this.data[i]) * (this.maxValue - this.data[i + 1]) / this.maxValue;
            if ((invert && value <= threshold) || (! invert && value >= threshold)) {
                newImage.setBit(ptr);
            }
            ptr++;
        }
    } else {
        for (let i = 0; i < this.data.length; i += this.channels) {
            if ((invert && this.data[i] >= threshold) || (! invert && this.data[i] <= threshold)) {
                newImage.setBit(ptr);
            }
            ptr++;
        }
    }

    return newImage;
}
