'use strict';

export default function luma709(newImage) {
    var ptr = 0;
    for (let i = 0; i < this.data.length; i += this.channels) {
        let greyPixel = this.data[i] * 0.2126 + this.data[i + 1] * 0.7152 + this.data[i + 2] * 0.0722;
        newImage.data[ptr++] = greyPixel;
        if (this.alpha) {
            newImage.data[ptr++]=this.data[i + 3];
        }
    }
}
