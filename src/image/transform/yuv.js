// based on https://bgrins.github.io/TinyColor/docs/tinycolor.html

import {RGB, YUV} from '../model/model';
import Image from '../image';

export default function yuv() {
    this.checkProcessable('yuv', {
        bitDepth: [8, 16],
        alpha: [0,1],
        colorModel: [RGB]
    });

    let newImage = Image.createFrom(this, {
        colorModel: RGB
    });

    let ptr = 0;
    let data = this.data;
    for (let i = 0; i < data.length; i += this.channels) {
        let red = data[i];
        let green = data[i + 1];
        let blue = data[i + 2];
        let Y= Math.floor((((0.257 * red) + (0.504 * green) + (0.098 * blue))))+16;
        let U= Math.floor((((0.439 * red - (0.368 * green) - (0.071 * blue)))))+128;
        let V=Math.floor(-(0.148 * red) - (0.291 * green) + (0.439 * blue)) + 128;


        newImage.data[ptr++] = Y;
        newImage.data[ptr++] = U;
        newImage.data[ptr++] = V;
        if (this.alpha) {
            newImage.data[ptr++] = data[i + 3];
        }
    }

    return newImage;
}