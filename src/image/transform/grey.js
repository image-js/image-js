import Image from '../image';
import {RGB} from '../model/model';
import {methods} from './greyAlgorithms';

/**
 * Converts the current image to grey scale
 * The source image has to be RGB !
 * If there is an alpha channel we need to decide what to do:
 * * keepAlpha : we will keep the alpha channel and you will get a GREY / A image
 * * mergeAlpha : we will multiply each pixel of the image by the alpha
 * @memberof Image
 * @instance
 * @returns {Image} - Grey scale image
 */

export default function grey({
    algorithm = 'luma709',
    keepAlpha = false,
    mergeAlpha = true,
    allowGrey = false
} = {}) {

    let valid = {
        bitDepth: [8, 16],
        alpha: [0,1]
    };

    if (!allowGrey) {
        valid.colorModel = [RGB];
        valid.components = [3];
    }

    this.checkProcessable('grey', valid);

    if (this.components === 1) {
        algorithm = 'red'; // actually we just take the first channel if it is a grey image
    }

    keepAlpha &= this.alpha;
    mergeAlpha &= this.alpha;
    if (keepAlpha) mergeAlpha = false;


    let newImage = Image.createFrom(this, {
        components: 1,
        alpha: keepAlpha,
        colorModel: null
    });

    let method = methods[algorithm.toLowerCase()];
    if (!method) throw new Error('Unsupported grey algorithm: ' + algorithm);


    let ptr = 0;
    for (let i = 0; i < this.data.length; i += this.channels) {
        if (mergeAlpha) {
            newImage.data[ptr++] = method(this.data, i, this) * this.data[i + this.components] / this.maxValue;
        } else {
            newImage.data[ptr++] = method(this.data, i, this);
            if (newImage.alpha) {
                newImage.data[ptr++] = this.data[i + this.components];
            }
        }
    }

    return newImage;
}

