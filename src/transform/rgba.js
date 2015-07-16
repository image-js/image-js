import Image from '../image';

export default function rgba() {

    if (this.colorModel === 'RGB' && this.alpha) {
        return this.clone();
    }

    let newImage = Image.createFrom(this, {
        kind: 'COLOR' + this.bitDepth
    });

    let ptr = 0;
    let data = this.data;
    for (let i = 0; i < data.length; i += this.channels) {
        newImage.data[ptr++] = data[i];
        newImage.data[ptr++] = data[i];
        newImage.data[ptr++] = data[i];
        ptr++;
    }

    return newImage;
}
