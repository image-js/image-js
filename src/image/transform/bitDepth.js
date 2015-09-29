import Image from '../image';

export default function bitDepth(newBitDepth) {

    this.checkProcessable('bitDepth', {
        bitDepth: [8,16]
    });

    if (! [8,16].contains(newBitDepth)) throw Error('You need to specify the new bitDepth as 8 or 16')

    if (newBitDepth === 8) {
        if (this.bitDepth === 8) {
            return this.clone();
        }

        let newImage = Image.createFrom(this, {
            bitDepth: 8
        });

        let data = this.data;
        for (let i = 0; i < this.data.length; i++) {
            newImage.data[i] = data[i] >> 8;
        }

        return newImage;
    }

    if (newBitDepth === 16) {
        this.checkProcessable('bitDepth', {
            bitDepth: [8,16]
        });

        if (this.bitDepth === 16) {
            return this.clone();
        }

        let newImage = Image.createFrom(this, {
            bitDepth: 16
        });

        let data = this.data;
        for (let i = 0; i < this.data.length; i++) {
            newImage.data[i] = data[i] << 8;
        }

        return newImage;
    }



}
