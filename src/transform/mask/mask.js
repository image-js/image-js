'use strict';

import IJ from '../../ij';

import thresholdAlgorithm from './threshold';

export default function mask({
        algorithm = 'threshold',
        threshold = 127,
        useAlpha = true
    } = {}) {
    this.checkProcessable('mask', {
        components: 1,
        bitDepth: [8, 16]
    });

    let newImage = IJ.createFrom(this, {
            kind: 'BINARY'
        }
    );

    switch (algorithm.toLowerCase()) {
        case 'threshold':
            thresholdAlgorithm.call(this, newImage, useAlpha, threshold);
            break;
        default:
            throw new Error('mask transform unknown algorithm: '+algorithm);
    }


    return newImage;
}

