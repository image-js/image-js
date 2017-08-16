import Matrix from 'ml-matrix';

/**
 * In mathematical morphology, the closing of a set A by a structuring element B is the erosion of the dilation of that set (Wikipedia). In image processing, closing is, together with opening, the basic workhorse of morphological noise removal. Opening removes small objects, while closing removes small holes.
 * http://docs.opencv.org/2.4/doc/tutorials/imgproc/opening_closing_hats/opening_closing_hats.html
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {Matrix} [options.kernel]
 * @param {number} [options.iterations] - number of iterations of the morphological transform
 * @return {Image}
 */
export default function closing(options = {}) {
    let {
        kernel = new Matrix([[1, 1, 1], [1, 1, 1], [1, 1, 1]]),
        iterations = 1
    } = options;

    this.checkProcessable('closing', {
        bitDepth: [8, 16],
        channel: [1]
    });
    if (kernel.columns - 1 % 2 === 0 || kernel.rows - 1 % 2 === 0) {
        throw new TypeError('closing: The number of rows and columns of the kernel must be odd');
    }

    let newImage = this.dilate({kernel: kernel});
    newImage = newImage.erode({kernel: kernel});
    if (iterations > 1) {
        for (let i = 1; i < iterations; i++) {
            newImage = newImage.dilate({kernel: kernel});
            newImage = newImage.erode({kernel: kernel});
        }
    }
    return newImage;
}
