'use strict';

export default function luma709(newImage, data) {
    var ptr = 0;
    for (let i = 0; i < data.length; i += this.channels) {
        let greyPixel = data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722;
        newImage.data[ptr++] = greyPixel;
        if (this.alpha) {
            newImage.data[ptr++]=data[i + 3];
        }
    }
}
