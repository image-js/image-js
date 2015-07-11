'use strict';

import IJ from '../ij';

export default function mask({algorithm = '', options = {}} = {}) {
    this.checkProcessable('mask', {
        components: 1,
        bitDepth: [8, 16]
    });

    var data = this.data;
    var threshold=options.threshold || 127;

    var useAlpha=options.useAlpha===false ? false : true;

    let newImage = IJ.createFrom(this, {
            kind: 'BINARY'
        }
    );

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

    return newImage;
}

