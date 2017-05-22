import {direct, fft} from 'ml-matrix-convolution';

import Image from '../Image';
import {validateArrayOfChannels} from '../../util/channel';
import {validateKernel} from '../../util/kernel';
import convolutionSeparable from '../operator/convolutionSeparable';

/**
 * @memberof Image
 * @instance
 * @param {Array<Array<number>>} kernel
 * @param {object} [options] - options
 * @param {Array} [options.channels] - Array of channels to treat. Defaults to all channels
 * @param {number} [options.bitDepth=this.bitDepth] - A new bit depth can be specified. This allows to use 32 bits to avoid clamping of floating-point numbers.
 * @param {boolean} [options.normalize=false]
 * @param {number} [options.divisor=1]
 * @param {string} [options.border='copy']
 * @param {string} [options.algorithm='auto'] - Either 'auto', 'direct' or 'fft'. fft is much faster for large kernel.
 * @return {Image}
 */
export default function convolution(kernel, options = {}) {
    let {
        channels,
        bitDepth,
        normalize = false,
        divisor = 1,
        border = 'copy',
        algorithm = 'auto'
    } = options;

    let newImage = Image.createFrom(this, {bitDepth});

    channels = validateArrayOfChannels(this, channels, true);
    //let kWidth, kHeight;
    //Very mysterious function. If the kernel is an array only one quadrant is copied to the output matrix,
    //but if the kernel is already a matrix, nothing is done.
    //On the other hand, it only consider odd, squared and symmetric kernels. A too restrictive
    //({kWidth, kHeight, kernel} = validateKernel(kernel));
    ({kernel} = validateKernel(kernel));

    if (algorithm === 'auto') {
        if (kernel.length > 9 || kernel[0].length > 9) {
            algorithm = 'fft';
        } else {
            algorithm = 'direct';
        }
    }
    if (this.width > 4096 || this.height > 4096) {
        algorithm = 'direct';
    }

    let halfHeight = Math.floor(kernel.length / 2);
    let halfWidth = Math.floor(kernel[0].length / 2);
    let clamped = newImage.isClamped;

    let tmpData = new Array(this.height * this.width);
    let index, x, y, channel, c, tmpResult;
    for (channel = 0; channel < channels.length; channel++) {
        c = channels[channel];
        //Copy the channel in a single array
        for (y = 0; y < this.height; y++) {
            for (x = 0; x < this.width; x++) {
                index = y * this.width + x;
                tmpData[index] = this.data[index * this.channels + c];
            }
        }
        if (algorithm === 'direct') {
            tmpResult = direct(tmpData, kernel, {
                rows: this.height,
                cols: this.width,
                normalize: normalize,
                divisor: divisor
            });
        } else if (algorithm === 'separable') {
            const projection = new Array(kernel.length);
            for (let i = 0; i < kernel.length; i++) {
                projection[i] = Math.sqrt(kernel[i][i]);
            }
            tmpResult = convolutionSeparable(tmpData, projection, this.width, this.height);
        } else {
            tmpResult = fft(tmpData, kernel, {
                rows: this.height,
                cols: this.width,
                normalize: normalize,
                divisor: divisor
            });
        }

        //Copy the result to the output image
        for (y = 0; y < this.height; y++) {
            for (x = 0; x < this.width; x++) {
                index = y * this.width + x;
                if (clamped) {
                    newImage.data[index * this.channels + c] = Math.min(Math.max(tmpResult[index], 0), newImage.maxValue);
                } else {
                    newImage.data[index * this.channels + c] = tmpResult[index];
                }
            }
        }
    }
    // if the kernel was not applied on the alpha channel we just copy it
    // TODO: in general we should copy the channels that where not changed
    // TODO: probably we should just copy the image at the beginning ?
    if (this.alpha && !channels.includes(this.channels)) {
        for (x = this.components; x < this.data.length; x = x + this.channels) {
            newImage.data[x] = this.data[x];
        }
    }

    //I only can have 3 types of borders:
    //  1. Considering the image as periodic: periodic
    //  2. Extend the interior borders: copy
    //  3. fill with a color: set
    if (border !== 'periodic') {
        newImage.setBorder({size: [halfWidth, halfHeight], algorithm: border});
    }

    return newImage;
}
