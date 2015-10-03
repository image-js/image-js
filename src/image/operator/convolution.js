import isInteger from 'is-integer';
import Image from '../image';

/**
 *
 * @param kernel
 * @param bitDepth : We can specify a new bitDepth for the image. This allow to specify 64 bits in order no to clamp
 * @param normalize
 * @param divisor
 * @param border
 * @returns {*}
 */
export default function convolution(kernel, {bitDepth, normalize = false, divisor = 1, border = 'copy'} = {}) {

    let newImage = Image.createFrom(this, {bitDepth: bitDepth});

    let kWidth, kHeight;


    if (Array.isArray(kernel)) {
        if (Array.isArray(kernel[0])) { // 2D array
            if (((kernel.length & 1) === 0) || ((kernel[0].length & 1) === 0))
                throw new RangeError('convolution: Kernel rows and columns should be odd numbers');
            else {
                kHeight = Math.floor(kernel.length / 2);
                kWidth = Math.floor(kernel[0].length / 2);
            }
        } else {
            let kernelWidth = Math.sqrt(kernel.length);
            if (isInteger(kernelWidth)) {
                kWidth = kHeight = Math.floor(Math.sqrt(kernel.length) / 2);
            } else {
                throw new RangeError('convolution: Kernel array should be a square');
            }
            // we convert the array to a matrix
            let newKernel = new Array(kWidth);
            for (let i = 0; i < kernelWidth; i++) {
                newKernel[i] = new Array(kernelWidth);
                for (let j = 0; j < kernelWidth; j++) {
                    newKernel[i][j] = kernel[i * kernelWidth + j];
                }
            }
            kernel = newKernel;

        }
    } else {
        throw new Error('convolution: Invalid Kernel: ' + kernel);
    }

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


    let maxValue = newImage.maxValue;
    if (newImage.bitDepth === 64) {
        maxValue = 0;
    }

    for (let y = kHeight; y < this.height - kHeight; y++) {
        for (let x = kWidth; x < this.width - kWidth; x++) {
            let sum = 0;
            for (let j = -kHeight; j <= kHeight; j++) {
                for (let i = -kWidth; i <= kWidth; i++) {
                    let kVal = kernel[kHeight + j][kWidth + i];
                    let index = ((y + j) * this.width + x + i) * this.channels;
                    sum += this.data[index] * kVal;
                }
            }

            let index = (y * this.width + x) * this.channels;
            if (maxValue === 0) { // we calculate the exact result
                newImage.data[index] = sum / divisor;
            } else {
                newImage.data[index] = Math.min(Math.max(Math.round(sum / divisor),0),this.maxValue);
            }

            if (this.alpha) newImage.data[index + 1] = this.data[index + 1];
        }
    }

    newImage.setBorder({size:[kWidth, kHeight], algorithm: border});

    return newImage;
}
