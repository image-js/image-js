
import Image from '../image';
import {validateArrayOfChannels} from '../../util/channel';
import {validateKernel} from '../../util/kernel';
/**
 *
 * @param kernel
 * @param bitDepth : We can specify a new bitDepth for the image. This allow to specify 64 bits in order no to clamp
 * @param normalize
 * @param divisor
 * @param border
 * @returns {*}
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
    if (this.alpha && channels.indexOf(this.channels) === -1) {
        for (let i = this.components; i < this.data.length; i = i + this.channels) {
            newImage.data[i] = this.data[i];
        }
    }

    newImage.setBorder({size:[kWidth, kHeight], algorithm: border});

    return newImage;
}
