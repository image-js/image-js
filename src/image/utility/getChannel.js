import Image from '../image';
import validateChannel from '../misc/validateChannel';

export default function getChannel( channel ) {

    this.checkProcessable('getChannel', {
        bitDepth: [8, 16]
    });

    channel = validateChannel(this,channel);


    let newImage = Image.createFrom(this, {
        components: 1,
        alpha: false,
        colorModel: null
    });
    let ptr = 0;
    for (let j = channel; j < this.data.length; j += this.channels) {
        newImage.data[ptr++] = this.data[j];
    }

    return newImage;
}
