'use strict';

export default function luma601(newImage) {
    let ptr = 0;
    for (let i = 0; i < this.data.length; i += this.channels) {
        newImage.data[ptr++] = this.data[i] * 0.299 + this.data[i + 1] * 0.587 + this.data[i + 2] * 0.114;
        if (this.alpha) {
            newImage.data[ptr++] = this.data[i + 3];
        }
    }
}
