'use strict'

//convolution using a square kernel
export default function convolution(newImage, kernel, edgeHandling){
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

    console.log(edgeHandling);

    if(edgeHandling != undefined)
        if(edgeHandling.toLowerCase() == 'black'){
            for(let x = 0; x < this.width; x++){
                for(let y = 0; y <= k; y++){
                    newImage.setValueXY(x, y, 0, 0);
                    newImage.setValueXY(x, y, 1, this.getValueXY(x, y, 1));
                }
                for(let y = this.height-k; y < this.height; y++){
                    newImage.setValueXY(x, y, 0, 0);
                    newImage.setValueXY(x, y, 1, this.getValueXY(x, y, 1));
                }
            }
            for(let x = 0; x < this.height; x++){
                for(let y = 0; y <= k; y++){
                    newImage.setValueXY(y, x, 0, 0);
                    newImage.setValueXY(y, x, 1, this.getValueXY(y, x, 1));
                }
                for(let y = this.width-k; y < this.width; y++){
                    newImage.setValueXY(y, x, 0, 0);
                    newImage.setValueXY(y, x, 1, this.getValueXY(y, x, 1));
                }
            }
        }else if(edgeHandling.toLowerCase() == 'copy'){
            for(let x = 0; x < this.width; x++){
                for(let y = 0; y <= k; y++){
                    newImage.setValueXY(x, y, 0, this.getValueXY(x, y, 0));
                    newImage.setValueXY(x, y, 1, this.getValueXY(x, y, 1));
                }
                for(let y = this.height-k; y < this.height; y++){
                    newImage.setValueXY(x, y, 0, this.getValueXY(x, y, 0));
                    newImage.setValueXY(x, y, 1, this.getValueXY(x, y, 1));
                }
            }
            for(let x = 0; x < this.height; x++){
                for(let y = 0; y <= k; y++){
                    newImage.setValueXY(y, x, 0, this.getValueXY(y, x, 0));
                    newImage.setValueXY(y, x, 1, this.getValueXY(y, x, 1));
                }
                for(let y = this.width-k; y < this.width; y++){
                    newImage.setValueXY(y, x, 0, this.getValueXY(y, x, 0));
                    newImage.setValueXY(y, x, 1, this.getValueXY(y, x, 1));
                }
            }
        }

}