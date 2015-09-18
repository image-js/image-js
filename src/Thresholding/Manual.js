/**
 * Created by cballesteros, kellyjoha and madeleine01 on 9/5/15.
 */

'use strict'

import Image from '../image';

export default function manualThreshold(th){
    //Validate gray scale
    this.checkProcessable('manualThreshold', {
        components:[1],//The image is a gray scale image
        bitDepth:[8,16]
    });

    //Validate threshold range
    if(th < 0 && th > 255){
        throw new Error('Threshold should be between 0 and 255');
    }

    //Create a copy from the original image
    let newImage = Image.createFrom(this, {
        kind: {
            components: 1,
            alpha: this.alpha,
            bitDepth: this.bitDepth,
            colorModel: null
        }
    });

    for(let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
            let pixel = this.getValueXY(x,y,0); //Get interes pixel
            if(pixel <= th){
                newImage.setValueXY(x, y, 0, 0);//Set pixel to newImage
                if(this.alpha){
                    newImage.setValueXY(x, y, 1, this.getValueXY(x, y, 1));//Copy the same alpha from the original Image
                }
            }else{
                newImage.setValueXY(x, y, 0, 255);//Set pixel to newImage
                if(this.alpha){
                    newImage.setValueXY(x, y, 1, this.getValueXY(x, y, 1));//Copy the same alpha from the original Image
                }
            }
        }//End for Y
    }//End for X

    return newImage;
}//End manualThreshold