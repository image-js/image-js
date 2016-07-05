import {validateArrayOfChannels} from '../../util/channel';
import Image from '../image';

/**
 * @memberof Image
 * @instance
 * @returns {Image}
 */

export default function medianFilter(radius, channels, border = 'copy') {
    this.checkProcessable('medianFilter', {
        bitDepth:[8,16]
    });

    if (radius < 1) {
        throw new Error('Kernel radius should be greater than 0');
    }

    channels = validateArrayOfChannels(this, channels, true);

    let kWidth = radius;
    let kHeight = radius;
    let newImage = Image.createFrom(this);

    let size = (kWidth * 2 + 1) * (kHeight * 2 + 1);
    let middle = Math.floor(size / 2);
    let kernel = new Array(size);

    for (let channel = 0; channel < channels.length; channel++) {
        let c = channels[channel];
        for (let y = kHeight; y < this.height - kHeight; y++) {
            for (let x = kWidth; x < this.width - kWidth; x++) {
                let n = 0;
                for (let j = -kHeight; j <= kHeight; j++) {
                    for (let i = -kWidth; i <= kWidth; i++) {
                        let index = ((y + j) * this.width + x + i) * this.channels + c;
                        kernel[n++] = this.data[index];
                    }
                }
                let index = (y * this.width + x) * this.channels + c;
                let newValue = kernel.sort()[middle];
                newImage.data[index] = newValue;
            }
        }
    }

    if (this.alpha && channels.indexOf(this.channels) === -1) {
        for (let i = this.components; i < this.data.length; i = i + this.channels) {
            newImage.data[i] = this.data[i];
        }
    }

    newImage.setBorder({size:[kWidth, kHeight], algorithm: border});

    return newImage;

}//End medianFilter function

