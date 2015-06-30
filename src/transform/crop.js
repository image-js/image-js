'use strict';

import IJ from '../ij';

export default function crop(x = 0,
                             y = 0,
                             width = this.width - x,
                             height = this.height - y) {
    if (x > (this.width - 1) || y > (this.height - 1))
        throw new RangeError(`origin (${x}; ${y}) out of range (${this.width - 1}; ${this.width - 1})`);
    if (width <= 0 || height <= 0)
        throw new RangeError('width and height must be positive numbers');

    var newImage = IJ.createFrom(this, {width, height});

    var xWidth = width * this.channels;
    var y1 = y + height;

    var ptr = 0; // pointer for new array

    var i, j, jL;
    var jLeft = x * this.channels;

    for (i = y; i < y1; i++) {
        j = (i * this.width * this.channels) + jLeft;
        jL = j + xWidth;
        for (; j < jL; j++) {
            newImage.data[ptr++] = this.data[j];
        }
    }

    return newImage;
}
