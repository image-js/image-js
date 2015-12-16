// based on https://bgrins.github.io/TinyColor/docs/tinycolor.html

import {RGB, YCBCR} from '../model/model';
import Image from '../image';

export default function ycbcr() {
    this.checkProcessable('ycbcr', {
        bitDepth: [8, 16],
        alpha: [0,1],
        colorModel: [RGB]
    });

    let newImage = Image.createFrom(this, {
        colorModel: YCBCR
    });

    let ptr = 0;
    let data = this.data;
    for (let i = 0; i < data.length; i += this.channels) {
        let red = data[i];
        let green = data[i + 1];
        let blue = data[i + 2];
        let Y= Math.floor((((0.299 * red) + (0.587 * green) + (0.114 * blue))));
        let Cb= Math.floor((((-0.16874 * red - 0.33126 * green + 0.50000 * blue))));
        let Cr=Math.floor((( 0.50000 * red - 0.41869 * green - 0.08131 * blue)));


        newImage.data[ptr] = Y;
        newImage.data[ptr+1] = Cb;
        newImage.data[ptr+2] = Cr;
        if (this.alpha) {
            newImage.data[ptr+3] = data[i + 3];
            ptr=ptr+4;
        }else{
            ptr=ptr+3;
        }


    }

    return newImage;
}