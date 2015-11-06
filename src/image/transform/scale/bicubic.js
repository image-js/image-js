/*
 ***************************************************************************
 *  Method bicubic interpolation
 *  see http://www.cyut.edu.tw/~yltang/program/BcScale.java
 ***************************************************************************
 */

import Image from '../../image';

export default function bicubic(newImage, newWidth, newHeight) {

    if (newWidth < 0 || newHeight < 0)
        throw new RangeError('Scaling factors should be greater than 0 ');

    let x_ratio = (this.width -1) / newWidth;
    let y_ratio = (this.height -1) / newHeight;
    let offset = 0;
    let y = 0;
    for (let i = 0; i < newHeight; i++) {
        let y0 = y | 0;
        let dy = y - y0;
        let x = 0;
        for (let j = 0; j < newWidth; j++) {
            let x0 = x | 0;
            let dx = x - x0;
            for (let c = 0; c < this.channels; c++) {
                let sum = 0;
                let index = (y0 * this.width + x0) * this.channels + c;
                for (let m = -1; m <= 2; m++) {
                    for (let n = -1; n <= 2; n++) {
                        if ((x0 + m >= 0) && (x0 + m < this.height) && (y0 + n >= 0) && (y0 + n < this.width)) {
                            //the problem could be in the pixel assignation
                            sum += this.data[index + (n * this.width + m) * this.channels] * R(m - dx) * R(dy - n); // this.data[index + this.channels]
                        } else {
                            sum += this.data[index] * R(m - dx) * R(dy - n);
                        }
                    }
                }
                newImage.data[offset++] = sum | 0;
            }
            x += x_ratio;
        }
        y += y_ratio;

    }
}

function R(x) {
    let p1 = x + 2 > 0 ? x + 2 : 0;
    p1 = p1 * p1 * p1;

    let p2 = x + 1 > 0 ? x + 1 : 0;
    p2 = p2 * p2 * p2;

    let p3 = x > 0 ? x : 0;
    p3 = p3 * p3 * p3;

    let p4 = x - 1 > 0 ? x - 1 : 0;
    p4 = p4 * p4 * p4;

    return (p1 - 4 * p2 + 6 * p3 - 4 * p4) / 6;
}
