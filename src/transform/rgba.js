import Image from '../image';

export default function rgba() {

    // TODO
    // should be renamed ro rgb ?
    // should be another method to force the addition of alpha channel ?

    if (this.colorModel === 0 && this.alpha) {
        return this.clone();
    }

    let newImage = Image.createFrom(this, {
        alpha: 1
    });

    let ptr = 0;
    let data = this.data;
    for (let i = 0; i < data.length; i += this.channels) {
        newImage.data[ptr++] = data[i];
        newImage.data[ptr++] = data[i+1];
        newImage.data[ptr++] = data[i+2];
        ptr++;
    }

    return newImage;
}
