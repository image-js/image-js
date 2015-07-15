'use strict';

import Image from '../image';

export default function rgba() {

    if (this.colorModel === 'RGB' && this.alpha) {
        return this.clone();
    }

    var newImage = Image.createFrom(this, {
        kind: 'COLOR' + this.bitDepth
    });

    var ptr = 0;
    var data = this.data;
    for (let i = 0; i < data.length; i += this.channels) {
        newImage.data[ptr++] = data[i];
        newImage.data[ptr++] = data[i];
        newImage.data[ptr++] = data[i];
        ptr++;
    }

    return newImage;
}
