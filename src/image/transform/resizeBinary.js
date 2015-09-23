import Image from '../image';
import * as KindNames from '../kindNames';

// This is a temporary code that should be placed in the more generate resize method
// it only works for scaled down !

export default function resizeBinary(scale=0.5, options = {}) {
    this.checkProcessable('resizeBinary', {
        bitDepth: [1],
        dimension: 2
    });

    let width=Math.floor(this.width*scale);
    let height=Math.floor(this.height*scale);
    let shiftX=Math.round((this.width-width)/2);
    let shiftY=Math.round((this.height-height)/2);

    let newImage=Image.createFrom(this, {
        kind: KindNames.BINARY,
        width: width,
        height: height,
        position: [shiftX, shiftY]
    });

    for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
            if (this.getBitXY(x,y)) {
                newImage.setBitXY(Math.floor(x*scale), Math.floor(y*scale));
            }
        }
    }

    return newImage;
}
