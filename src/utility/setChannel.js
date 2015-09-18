import Image from '../image';
import validateChannel from '../misc/validateChannel';

export default function setChannel(channel, image) {

    this.checkProcessable('setChannel', {
        bitDepth: [8, 16]
    });

    image.checkProcessable('setChannel (image parameter check)', {
        bitDepth: [this.bitDepth],
        alpha: [0],
        components: [1]
    });

    channel = validateChannel(this,channel);

    let ptr=channel;
    for (let i=0; i<image.data.length; i++) {
        this.data[ptr]=image.data[i];
        ptr+=this.channels;
    }
}
