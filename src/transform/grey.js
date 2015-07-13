'use strict';

import IJ from '../ij';
import {RGB} from '../model/models';

import luma709 from './grey-algorithm/luma709';

export default function grey({algorithm = 'luma709'} = {}) {

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

    switch (algorithm.toLowerCase()) {
        case 'luma709': // sRGB
            luma709.call(this, newImage, data);
            break;
        case 'luma601': // NTSC
            for (let i = 0; i < data.length; i += this.channels) {
                var greyPixel = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
                newImage.data[ptr++] = greyPixel;
                if (this.alpha) {
                    newImage.data[ptr++]=data[i + 3];
                }
            }
            break;
        case 'minmax': // used in HSL color model
            for (let i = 0; i < data.length; i += this.channels) {
                var greyPixel = (Math.max(data[i], data[i + 1], data[i + 2])+Math.min(data[i], data[i + 1], data[i + 2]))/2;
                newImage.data[ptr++] = greyPixel;
                if (this.alpha) {
                    newImage.data[ptr++]=data[i + 3];
                }
            }
            break;
        case 'maximum':
            for (let i = 0; i < data.length; i += this.channels) {
                var greyPixel = Math.max(data[i], data[i + 1], data[i + 2]);
                newImage.data[ptr++] = greyPixel;
                if (this.alpha) {
                    newImage.data[ptr++]=data[i + 3];
                }
            }
            break;
        case 'average': // used in HSI color model
            for (let i = 0; i < data.length; i += this.channels) {
                var greyPixel = (data[i]+data[i + 1]+data[i + 2])/3;
                newImage.data[ptr++] = greyPixel;
                if (this.alpha) {
                    newImage.data[ptr++]=data[i + 3];
                }
            }
            break;
        default:
            throw new Error ("Unsupported algorithm: "+algorithm);
    }


    return newImage;
}
