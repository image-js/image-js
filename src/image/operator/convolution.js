import Image from '../image';
import {validateArrayOfChannels} from '../../util/channel';
import {validateKernel} from '../../util/kernel';
let conv = require('ml-matrix-convolution');


/**
 * @memberof Image
 * @instance
 * @param {[[number]]} kernel
 * @param {object} [$1] - options
 * @param {array} [$1.channels] - Array of channels to treat. Defaults to all channels
 * @param {number} [$1.bitDepth=this.bitDepth] - A new bit depth can be specified. This allows to use 32 bits to avoid clamping of floating-point numbers.
 * @param {boolean} [$1.normalize=false]
 * @param {number} [$1.divisor=1]
 * @param {string} [$1.border='copy']
 * @returns {Image}
 */
export default function convolution(kernel, {channels, bitDepth, normalize = false, divisor = 1, border = 'copy', type = 'direct'} = {}) {

    let newImage = Image.createFrom(this, {bitDepth: bitDepth});

    channels = validateArrayOfChannels(this, channels, true);
    let kWidth, kHeight;
    //Very misterious function. If the kernel is an array only one quadrant is copied to the output matrix,
    //but if the kernel is already a matrix, nothing is done.
    //On the other hand, it only consider odd, squared and symmetric kernels. A too restrictive
    ({kWidth, kHeight, kernel} = validateKernel(kernel));


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
        if(type=='direct'){
            tmpResult = conv.direct(tmpData, kernel, {
                rows: this.height,
                cols: this.width,
                normalize: normalize,
                divisor: divisor
            });
        }
        else{
            tmpResult = conv.fft(tmpData, kernel, {
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
                if (clamped)
                    newImage.data[index * this.channels + c] = Math.min(Math.max(tmpResult[index], 0), newImage.maxValue);
                else
                    newImage.data[index * this.channels + c] = tmpResult[index];
            }
        }
    }
    // if the kernel was not applied on the alpha channel we just copy it
    // TODO: in general we should copy the channels that where not changed
    // TODO: probably we should just copy the image at the beginning ?
    if (this.alpha && channels.indexOf(this.channels) === -1) {
        for (x = this.components; x < this.data.length; x = x + this.channels) {
            newImage.data[x] = this.data[x];
        }
    }

    //I only can have 3 types of borders:
    //  1. Considering the image as periodic: periodic
    //  2. Extend the interior borders: copy
    //  3. fill with a color: set
    if ( border != 'periodic' ){
        newImage.setBorder({size: [halfWidth, halfHeight], algorithm: border});
    }

    return newImage;
}
