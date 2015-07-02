'use strict';

import IJ from '../ij';
import {RGB} from '../model/models';

export default function grey({algorithm = 'luminance'} = {}) {

    if (this.kind.startsWith('GREY')) {
        return this.clone();
    }

    this.checkProcessable('grey', {colorModel: RGB});

    var newImage = IJ.createFrom(this, {
        kind: 'GREY' + this.bitDepth
    });

    var ptr = 0;
    var data = this.data;
    for (let i = 0; i < data.length; i += this.channels) {
        var greyPixel = data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722;
        if (this.alpha) {
            greyPixel *= data[i + 3] / this.maxValue;
        }
        newImage.data[ptr++] = greyPixel;
    }

    return newImage;
}
