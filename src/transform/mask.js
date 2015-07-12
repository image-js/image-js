'use strict';

import IJ from '../ij';

export default function mask({algorithm = 'threshold', threshold = 127, useAlpha = true} = {}) {
    this.checkProcessable('mask', {
        components: 1,
        bitDepth: [8, 16]
    });

    var data = this.data;

    let newImage = IJ.createFrom(this, {
            kind: 'BINARY'
        }
    );

    switch (algorithm) {
        case 'threshold':
            if (this.alpha && useAlpha) {
                for (let i = 0; i < data.length; i += 2) {
                    if ((data[i]*data[i+1]/this.maxValue)>=threshold) {
                        newImage.setBit(i>>1);  // we divide by 2 the geek way ;)
                    }
                }
            } else {
                for (let i = 0; i < data.length; i++) {
                    if (data[i]>=threshold) {
                        newImage.setBit(i);
                    }
                }
            }
            break;
        default:
            throw new Error('mask transform unknown algorithm: '+algorithm);
    }


    return newImage;
}

