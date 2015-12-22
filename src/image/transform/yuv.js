/* based on https://bgrins.github.io/TinyColor/docs/tinycolor.html*/


import {RGB, YUV} from '../model/model';
import Image from '../image';

export default function yuv() {


    let newImage = Image.createFrom(this, {
        colorModel: RGB
    });

    let ptr = 0;
    let data = this.data;
    for (let i = 0; i < data.length; i += this.channels) {
        let red = data[i];
        let green = data[i + 1];
        let blue = data[i + 2];
        let Y= Math.floor(Math.abs(((0.299 * red) + (0.587 * green) + (0.114 * blue))))+16;
        let U= ((blue - Y) * 0.492)+128;
        let V=((red - Y) * 0.877)+128;


        newImage.data[ptr++] = Y;
        newImage.data[ptr++] = U;
        newImage.data[ptr++] = V;
        if (this.alpha) {
            newImage.data[ptr++] = data[i + 3];
        }
    }

    return newImage;
}