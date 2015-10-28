/*
 ***************************************************************************
 *  bilinear interpolation
 ***************************************************************************
 */

import Image from '../../image';

export default function bilinear(newImage, newWidth, newHeight) {

    if (newWidth < 0 || newHeight < 0)
        throw new RangeError('Scaling factors should be greater than 0 ');

    let x_ratio = (this.width - 1) / newWidth;
    let y_ratio = (this.height - 1) / newHeight;
    let offset = 0;
    for (let i = 0; i < newHeight; i++) {
        for (let j = 0; j < newWidth; j++) {
            for (let c = 0; c < this.components; c++) {
                let x0 = (x_ratio * j);
                let y0 = (y_ratio * i);
                let x = x0 | 0;
                let y = y0 | 0;
                let x_diff = x0 - x;
                let y_diff = y0 - y;
                let index = (y * this.width + x) * this.components;

                let A = this.getValue(index, c);
                let B = this.getValue(index + 1, c);
                let C = this.getValue(index + this.width, c);
                let D = this.getValue(index + this.width + 1, c);

                let result = (A * (1 - x_diff) * (1 - y_diff) + B * (x_diff) * (1 - y_diff) + C * (y_diff) * (1 - x_diff)
                    + D * (x_diff * y_diff)) | 0;

                newImage.setValue(offset++, c, result);
            }
        }
    }
}
