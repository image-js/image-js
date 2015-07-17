'use strict';

import Image from '../image';

// first release of mean filter
export default function meanFilter(k){

    this.checkProcessable({
        components:[1],
        bitDepth:[8,16]
    });

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
    let div = 0;

    for(let i = 0; i < kernel.length; i++){
        kernel[i] = 1;
        div++;
    }

    //convolution
    let sum, newValue;
    for(let y = k; y < this.height-k; y++){
        for(let x = k; x < this.width-k; x++){
            sum = 0;
            for(let i = -k; i <= k; i++){
                for(let j = -k; j <= k; j++){
                    sum += this.getValueXY(x + i, y + j, 0)*kernel[(i + k)*n + (j + k)];
                }
            }
            newValue = Math.floor(sum/div);
            newImage.setValueXY(x, y, 0, newValue);
            if(this.alpha){
                newImage.setValueXY(x,y,1, this.getValueXY(x,y,1));
            }
        }
    }

    return newImage;
}