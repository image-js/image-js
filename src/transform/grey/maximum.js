'use strict';

export default function luma709(newImage) {
    var ptr = 0;
    for (let i = 0; i < this.data.length; i += this.channels) {
        var greyPixel = Math.max(this.data[i], this.data[i + 1], this.data[i + 2]);
        newImage.data[ptr++] = greyPixel;
        if (this.alpha) {
            newImage.data[ptr++]=this.data[i + 3];
        }
    }
}
