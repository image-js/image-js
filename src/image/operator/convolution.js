import Image from '../image';
import {validateArrayOfChannels} from '../../util/channel';
import {validateKernel} from '../../util/kernel';

/**
 * @memberof Image
 * @instance
 * @param {[[number]]} kernel
 * @param {object} $1 - options
 * @param {array} [$1.channels] - Array of channels to treat. Defaults to all channels
 * @param {number} [$1.bitDepth=this.bitDepth] - A new bit depth can be specified. This allows to use 32 bits to avoid clamping of floating-point numbers.
 * @param {boolean} [$1.normalize=false]
 * @param {number} [$1.divisor=1]
 * @param {string} [$1.border='copy']
 * @returns {Image}
 */
export default function convolution(kernel, {channels, bitDepth, normalize = false, divisor = 1, border = 'copy'} = {}) {

    let newImage = Image.createFrom(this, {bitDepth: bitDepth});

    channels = validateArrayOfChannels(this, channels, true);

    let kWidth, kHeight;
    ({kWidth, kHeight, kernel} = validateKernel(kernel));

    //calculate divisor
    if (normalize) {
        divisor = 0;
        for (let i = 0; i < kernel.length; i++)
            for (let j = 0; j < kernel[0].length; j++)
                divisor += kernel[i][j];
    }

    if (divisor === 0) {
        throw new RangeError('convolution: The divisor is equal to zero');
    }


    let clamped = newImage.isClamped;

    for (let channel = 0; channel < channels.length; channel++) {
        let c = channels[channel];
        for (let y = kHeight; y < this.height - kHeight; y++) {
            for (let x = kWidth; x < this.width - kWidth; x++) {
                let sum = 0;
                for (let j = -kHeight; j <= kHeight; j++) {
                    for (let i = -kWidth; i <= kWidth; i++) {
                        let kVal = kernel[kHeight + j][kWidth + i];
                        let index = ((y + j) * this.width + x + i) * this.channels + c;
                        sum += this.data[index] * kVal;
                    }
                }

                let index = (y * this.width + x) * this.channels + c;
                if (clamped) { // we calculate the clamped result
                    newImage.data[index] = Math.min(Math.max(Math.round(sum / divisor), 0), newImage.maxValue);
                } else {
                    newImage.data[index] = sum / divisor;
                }
            }
        }
    }
    // if the kernel was not applied on the alpha channel we just copy it
    // TODO: in general we should copy the channels that where not changed
    // TODO: probably we should just copy the image at the beginning ?

    if (this.alpha && channels.indexOf(this.channels) === -1) {
        for (let i = this.components; i < this.data.length; i = i + this.channels) {
            newImage.data[i] = this.data[i];
        }
    }

    newImage.setBorder({size:[kWidth, kHeight], algorithm: border});

    return newImage;
}
