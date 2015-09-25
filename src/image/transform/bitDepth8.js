import Image from '../image';

export default function bitDepth8() {

    this.checkProcessable('bitDepth8', {
        bitDepth: [8,16]
    });

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
