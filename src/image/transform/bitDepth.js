import Image from '../image';

export default function bitDepth(newBitDepth = 8) {

    this.checkProcessable('bitDepth', {
        bitDepth: [8, 16]
    });

    if (![8,16].includes(newBitDepth)) throw Error('You need to specify the new bitDepth as 8 or 16');

    if (this.bitDepth === newBitDepth) return this.clone();

    let newImage = Image.createFrom(this, {bitDepth: newBitDepth});

    if (newBitDepth === 8) {
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
