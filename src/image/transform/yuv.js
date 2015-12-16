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
        colorModel: YUV
    });

    let ptr = 0;
    let data = this.data;
    for (let i = 0; i < data.length; i += this.channels) {
        let red = data[i];
        let green = data[i + 1];
        let blue = data[i + 2];
        let Y= Math.floor(Math.abs(((0.299 * red) + (0.587 * green) + (0.114 * blue))));
        let U= Math.floor(Math.abs(((blue - Y) * 0.492)));
        let V=Math.floor(Math.abs(((red - Y) * 0.877)));


        newImage.data[ptr++] = Y;
        newImage.data[ptr++] = U;
        newImage.data[ptr++] = V;
        if (this.alpha) {
            newImage.data[ptr++] = data[i + 3];
        }
    }

    return newImage;
}