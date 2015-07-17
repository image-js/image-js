'use strict';

import Image from '../image';
import convolution from '../operator/convolution';

// first release of mean filter
export default function meanFilter(k){

    this.checkProcessable({
        components:[1],
        bitDepth:[8,16]
    });

    if(k < 1){
        throw new Error('Number of neighbors should be grater than 0');
    }

    //mean filter do not is in place

    let newImage = Image.createFrom(this, {
        kind: {
            components: 1,
            alpha: this.alpha,
            bitDepth: this.bitDepth,
            colorModel: null
        }
    });

    /*
    Example of 3x3 kernel:
    1   1   1
    1   1   1
    1   1   1
    */
    let n = 2*k + 1;
    let size = n*n;
    let kernel = new Int8Array(size);

    for(let i = 0; i < kernel.length; i++){
        kernel[i] = 1;
    }

    convolution.call(this, newImage, kernel);

    return newImage;
}