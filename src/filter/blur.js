'use strict';

import Image from '../image';

// first release of mean filter
export default function meanFilter(k){

    if(this.components > 1){
        throw new Error('Only support for image in gray scale');
    }

    if(k < 1){
        throw new Error('k must be grater than 0');
    }

    //mean filter do not is in place
    var newImage = Image.createFrom(this, {
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
    var n = 2*k + 1;
    var kernel = new Int8Array(n*n);

    for(let i = 0; i < kernel.length; i++){
        kernel[i] = 1;
    }

    var div = n*n;

    //convolution
    var sum;
    for(let y = 0; y < this.height; y++){
        for(let x = 0; x < this.width; x++){
            sum = 0;
            for(let i = -k; i <= k; i++){
                for(let j = -k; j <= k; j++){
                    sum += this.getValueXY(x + i, y + j, 0)*kernel[(i + k)*n + (j + k)];
                }
            }
            var newValue = Math.floor(sum/div);
            newImage.setValueXY(x, y, 0, newValue);
        }
    }


    return newImage;
}