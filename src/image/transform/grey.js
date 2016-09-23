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
 * @param {object} options
 * @param {string} [options.algorithm='luma709'] - Algorithm to get the grey image
 * @param {boolean} [options.keepAlpha=false] - If true the RGB values are treated
 *          separately from the alpha channel and the method returns a GREYA image.
 * @param {boolean} [options.mergeAlpha=true] - If true the alpha channel will be applied on each pixel.
 *          This means that if for an 8bits RGBA image we have an alpha channel value of 0,
 *          this grey scale value will always be 0 (black pixel)
 * @param {boolean} [options.allowGrey=false] - By default only RGB images are allowed.
 *          If true grey images are also allowed and will either return a copy or
 *          apply the alpha channel depending the options
 * @returns {Image} - Grey scale image (with or without alpha depending the options)
 * @example
 * var grey = image.grey();
 */

export default function grey(options = {}) {
    let {
        algorithm = 'luma709',
        keepAlpha = false,
        mergeAlpha = true,
        allowGrey = false
    } = options;

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

