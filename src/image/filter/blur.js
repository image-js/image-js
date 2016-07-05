
import convolution from '../operator/convolution';

/**
 * @memberof Image
 * @instance
 * @returns {Image}
 */

// first release of mean filter
export default function meanFilter(k) {

    this.checkProcessable('meanFilter', {
        components:[1],
        bitDepth:[8,16]
    });

    if (k < 1) {throw new Error('Number of neighbors should be grater than 0');}

    let n = 2 * k + 1;
    let size = n * n;
    let kernel = new Array(size);

    for (let i = 0; i < kernel.length; i++) {
        kernel[i] = 1;
    }

    return convolution.call(this, kernel);
}
