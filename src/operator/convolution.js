'use strict'

import edgeHandlingMethod from './edgeHandlingMethod'

//convolution using a square kernel
export default function convolution(newImage, kernel, edgeHandling){
    let kernelWidth = Math.sqrt(kernel.length);
    let k = Math.floor(kernelWidth/2);
    let div = 0;
    edgeHandling = edgeHandling || 'copy';

    for(let i = 0; i < kernel.length; i++){
        div += kernel[i];
    }

    for(let x = 0; x < this.width ; x++){
        for(let y = 0; y < this.height ; y++){
            let sum = 0;
            for(let i = -k; i <= k; i++){
                for(let j = -k; j <= k; j++){
                    let val = edgeHandling.toLowerCase() == 'mirror'
                        ? mirrorValue(x, y, i, j, this)
                        : (isOutSidePixel(x, y, this) ? undefined : this.getValueXY(x + i, y + j, 0));
                    if(val != undefined)
                        sum += val*kernel[(i + k)*kernelWidth + (j + k)];
                }
            }
            let newValue = Math.floor(sum/div);
            newImage.setValueXY(x, y, 0, newValue);
            if(this.alpha){
                newImage.setValueXY(x, y, 1, this.getValueXY(x, y, 1));
            }
        }
    }

    if(edgeHandling.toLowerCase() != 'mirror'){
        edgeHandlingMethod.call(this, newImage, edgeHandling.toLowerCase(), k);
    }

}

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