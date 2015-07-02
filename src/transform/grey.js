'use strict';

import IJ from '../ij';

export default function grey({algorithm = 'luminance'} = {}) {

    if (this.kind.startsWith('GREY')) {
        return this.clone();
    }

    if (this.colorModel !== 'RGB') {
        throw new Error('grey only applies to RGB images');
    }

    var newImage = IJ.createFrom(this, {
        kind: 'GREY' + this.bitDepth
    });

    var data = this.data;
    for (let i = 0; i < data.length; i += this.channels) {
        var greyPixel = data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722;
        if (this.alpha) {
            greyPixel *= data[i + 3] / this.maxValue;
        }
    }

    return newImage;
}
