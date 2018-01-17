import Matrix from 'ml-matrix';

/**
 * This function is the black top hat (also called black hat).
 * In mathematical morphology and digital image processing,
 * top-hat transform is an operation that extracts small elements and details from given images.
 * The black top-hat transform is defined dually as the difference between the closing and the input image.
 * Top-hat transforms are used for various image processing tasks, such as feature extraction, background equalization,
 * image enhancement, and others. (Wikipedia)
 * http://docs.opencv.org/2.4/doc/tutorials/imgproc/opening_closing_hats/opening_closing_hats.html
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {Matrix} [options.kernel]
 * @param {number} [options.iterations] - number of iterations of the morphological transform
 * @return {Image}
 */
export default function blackHat(options = {}) {
    let {
        kernel = new Matrix([[1, 1, 1], [1, 1, 1], [1, 1, 1]]),
        iterations = 1
    } = options;

    this.checkProcessable('blackHat', {
        bitDepth: [8, 16],
        channel: [1]
    });
    if (kernel.columns - 1 % 2 === 0 || kernel.rows - 1 % 2 === 0) {
        throw new TypeError('black hat: The number of rows and columns of the kernel must be odd');
    }


    let closeImage = this.closing({ kernel: kernel });
    let newImage = closeImage.subtractImage(this, { absolute: true });
    if (iterations > 1) {
        for (let i = 1; i < iterations; i++) {
            closeImage = newImage.closing({ kernel: kernel });
            newImage = closeImage.subtractImage(newImage, { absolute: true });
        }
    }
    return newImage;
}
