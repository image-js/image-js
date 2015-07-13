'use strict';

export default function threshold(newImage, useAlpha, threshold) {
    if (this.alpha && useAlpha) {
        for (let i = 0; i < this.data.length; i += 2) {
            if ((this.data[i]*this.data[i+1]/this.maxValue)>=threshold) {
                newImage.setBit(i>>1);  // we divide by 2 the geek way ;)
            }
        }
    } else {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i]>=threshold) {
                newImage.setBit(i);
            }
        }
    }
}
