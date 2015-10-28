/*
 ***************************************************************************
 * Method bilinear interpolation
 * see http://tech-algorithm.com/articles/bilinear-image-scaling/
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

                let x0 = (x_ratio * j);
                let y0 = (y_ratio * i);
                let x = x0 | 0;
                let y = y0 | 0;
                let x_diff = x0 - x;
                let y_diff = y0 - y;

            for (let c = 0; c < this.channels; c++) {

                let index = (y * this.width + x) * this.channels + c;

                let A = this.data[index];
                let B = this.data[index + this.channels];
                let C = this.data[index + this.width * this.channels ];
                let D = this.data[index + this.width * this.channels + this.channels];

                let result = (A * (1 - x_diff) * (1 - y_diff) + B * (x_diff) * (1 - y_diff) + C * (y_diff) * (1 - x_diff)
                    + D * (x_diff * y_diff)) | 0;

                newImage.data[offset++] = result;
            }
        }
    }
}
