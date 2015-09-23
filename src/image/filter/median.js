/**
 * Created by Cristian on 18/07/2015.
 */

import Image from '../image';
//k: size of kernel (k*k)
export default function medianFilter(k){
    this.checkProcessable('medianFilter', {
        components:[1],
        bitDepth:[8,16]
    });

    if(k < 1){throw new Error('Kernel size should be grater than 0');}

    let newImage = Image.createFrom(this, {
        kind: {
            components: 1,
            alpha: this.alpha,
            bitDepth: this.bitDepth,
            colorModel: null
        }
    });

    let size = k*k;
    let kernel = new Array(size);

    for(let x = 0; x < this.width; x++){
        for(let y = 0; y < this.height; y++){
            let n = 0;
            for(let i = -k; i <= k; i++){
                for(let j = -k; j <= k; j++){
                    let val = isOutSidePixel(x+i,y+j,this)
                        ? mirrorValue(x, y, i, j, this)
                        : this.getValueXY(x+i,y+j,0);
                    kernel[n] = val;
                    n++;
                }
            }
            let newValue = kernel.sort()[Math.floor(kernel.length/2)];
            newImage.setValueXY(x, y, 0, newValue);
            if(this.alpha){
                newImage.setValueXY(x, y, 1, this.getValueXY(x, y, 1));
            }
        }
    }

    return newImage;
}//End medianFilter function

function isOutSidePixel(x,y,im){
    return x > im.width || x < 0 || y > im.height || y < 0;
}

function mirrorValue(x,y,i,j,im){
    if(!isOutSidePixel(x+i,y+j,im)){
        return im.getValueXY(x+i,y+j,0);
    }else if(!isOutSidePixel(x-i,y+j,im)){
        return im.getValueXY(x-i,y+j,0);
    }else if(!isOutSidePixel(x+i,y-j,im)){
        return im.getValueXY(x+i,y-j,0);
    }else if(!isOutSidePixel(x-i,y-j,im)){
        return im.getValueXY(x-i,y-j,0);
    }else{
        return 0;
    }
}