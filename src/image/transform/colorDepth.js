import Image from '../image';

/**
 * @memberof Image
 * @instance
 */

export default function colorDepth(newColorDepth = 8) {

    this.checkProcessable('colorDepth', {
        bitDepth: [8, 16]
    });

    if (!~[8,16].indexOf(newColorDepth)) throw Error('You need to specify the new colorDepth as 8 or 16');

    if (this.bitDepth === newColorDepth) return this.clone();

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
