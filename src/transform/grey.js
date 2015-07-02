'use strict';

import IJ from '../ij';
import {RGB} from '../model/models';

export default function grey({algorithm = 'luminance'} = {}) {

    if (this.components === 1) {
        return this.clone();
    }

    this.checkProcessable('grey', {colorModel: RGB});

    var newImage = IJ.createFrom(this, {
        kind: {
            components: 1,
            alpha: this.alpha,
            bitDepth: this.bitDepth,
            colorModel: null
        }
    });

    var ptr = 0;
    var data = this.data;
    for (let i = 0; i < data.length; i += this.channels) {
        var greyPixel = data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722;
        newImage.data[ptr++] = greyPixel;
        if (this.alpha) {
            newImage.data[ptr++]=data[i + 3];
        }
    }

    return newImage;
}
