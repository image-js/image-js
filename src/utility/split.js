import Image from '../image';

export default function split({preserveAlpha = true} = {}) {

    this.checkProcessable('split', {
        bitDepth: [8, 16]
    });

    // split will always return an array of images
    if (this.components === 1) {
        return [this.clone()];
    }

    let images = [];

    let data = this.data;
    if (this.alpha && preserveAlpha) {
        for (let i = 0; i < this.components; i++) {
            let newImage = Image.createFrom(this, {
                components: 1,
                alpha: true,
                colorModel: null
            });
            let ptr = 0;
            for (let j = 0; j < data.length; j += this.channels) {
                newImage.data[ptr++] = data[j + i];
                newImage.data[ptr++] = data[j + this.components];
            }
            images.push(newImage);
        }
    } else {
        for (let i = 0; i < this.channels; i++) {
            let newImage = Image.createFrom(this, {
                components: 1,
                alpha: false,
                colorModel: null
            });
            let ptr = 0;
            for (let j = 0; j < data.length; j += this.channels) {
                newImage.data[ptr++] = data[j + i];
            }
            images.push(newImage);
        }
    }

    return images;
}
