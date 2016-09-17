import Image from '../image';
import {validateChannel} from './../../util/channel';

/**
 * @memberof Image
 *
 * alpha  String : possible values: 'skip', 'keep', 'join' (default: 'skip')
 *
 * @instance
 */

export default function combineChannels(
    method = function (pixel) {
        return (pixel[0] + pixel[1] + pixel[2]) / 3;
    }, {
    keepAlpha = false,
    joinAlpha = false
} = {}) {

    keepAlpha &= this.alpha;
    joinAlpha &= this.alpha;

    this.checkProcessable('combineChannels', {
        bitDepth: [8, 16]
    });

    let newImage = Image.createFrom(this, {
        components: 1,
        alpha: keepAlpha,
        colorModel: null
    });

    let ptr = 0;
    for (let i = 0; i < this.size; i++) {
        let value = method(this.getPixel(i));
        if (joinAlpha) {
            newImage.data[ptr++] = value * this.data[i * this.channels + this.components] / this.maxValue;
        } else {
            newImage.data[ptr++] = value;
            if (keepAlpha) {
                newImage.data[ptr++] = this.data[i * this.channels + this.components];
            }
        }
    }

    return newImage;
}
