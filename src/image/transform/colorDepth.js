import Image from '../Image';

/**
 * Change the image color depth.
 * The color depth is the number of bits that is assigned to each point of a channel.
 * For normal images it is 8 bits meaning the value is between 0 and 255.
 * Currently only conversion from 8 to 16 bits and 16 to 8 bits is allowed.
 * @memberof Image
 * @instance
 * @param {number} [newColorDepth=8]
 * @return {Image} The new image
 * @example
 * var newImage = image.colorDepth({
 *   newColorDepth:8
 * });
 */


export default function colorDepth(newColorDepth = 8) {

    this.checkProcessable('colorDepth', {
        bitDepth: [8, 16]
    });

    if (! [8, 16].includes(newColorDepth)) {
        throw Error('You need to specify the new colorDepth as 8 or 16');
    }

    if (this.bitDepth === newColorDepth) {
        return this.clone();
    }

    let newImage = Image.createFrom(this, {bitDepth: newColorDepth});

    if (newColorDepth === 8) {
        for (let i = 0; i < this.data.length; i++) {
            newImage.data[i] = this.data[i] >> 8;
        }
    } else {
        for (let i = 0; i < this.data.length; i++) {
            newImage.data[i] = this.data[i] << 8 | this.data[i];
        }
    }

    return newImage;
}
