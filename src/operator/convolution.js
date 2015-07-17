'use strict'

//convolution using a square kernel
export default function convolution(newImage, kernel){
    let kernelWidth = Math.sqrt(kernel.length);
    let k = Math.floor(kernelWidth/2);
    let div = 0;
    let sum;

    for(let i = 0; i < kernel.length; i++){
        div += kernel[i];
    }

    for(let x = k; x < this.width - k; x++){
        for(let y = k; y < this.height - k; y++){
            sum = 0;
            for(let i = -k; i <= k; i++){
                for(let j = -k; j <= k; j++){
                    sum += this.getValueXY(x + i, y + j, 0)*kernel[(i + k)*kernelWidth + (j + k)];
                }
            }
            let newValue = Math.floor(sum/div);
            newImage.setValueXY(x, y, 0, newValue);
            if(this.alpha){
                newImage.setValueXY(x, y, 1, this.getValueXY(x, y, 1));
            }
        }
    }

}