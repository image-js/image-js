import Image from '../Image';
import {BINARY} from '../kindNames';

/**
 * This is a temporary code that should be placed in the more general resize method
 * it only works for scaled down !
 * @memberof Image
 * @instance
 * @param {number} [scale=0.5]
 * @return {Image}
 */
export default function resizeBinary(scale = 0.5) {
    this.checkProcessable('resizeBinary', {
        bitDepth: [1]
    });

    let width = Math.max(Math.floor(this.width * scale),1);
    let height = Math.max(Math.floor(this.height * scale),1);
    let shiftX = Math.round((this.width - width) / 2);
    let shiftY = Math.round((this.height - height) / 2);

    let newImage = Image.createFrom(this, {
        kind: BINARY,
        width: width,
        height: height,
        position: [shiftX, shiftY],
        parent: this
    });

    for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
            if (this.getBitXY(x, y)) {
                newImage.setBitXY(Math.floor(x * scale), Math.floor(y * scale));
            }
        }
    }

    return newImage;
}
