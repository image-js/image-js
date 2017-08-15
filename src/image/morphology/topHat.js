/**
 * This function is the white top hat (also called top hat). In mathematical morphology and digital image processing, top-hat transform is an operation that extracts small elements and details from given images. The white top-hat transform is defined as the difference between the input image and its opening by some structuring element. Top-hat transforms are used for various image processing tasks, such as feature extraction, background equalization, image enhancement, and others. (Wikipedia)
 * http://docs.opencv.org/2.4/doc/tutorials/imgproc/opening_closing_hats/opening_closing_hats.html
 * @memberof Image
 * @instance
 * @param {Matrix} kernel
 * @param {number} iterations - number of iterations of the morphological transform
 * @return {Image}
 */
export default function topHat(kernel, iterations = 1) {
    this.checkProcessable('topHat', {
        bitDepth: [8, 16],
        channel: [1]
    });
    if (kernel.columns - 1 % 2 === 0 || kernel.rows - 1 % 2 === 0) {
        throw new TypeError('topHat: The number of rows and columns of the kernel must be odd');
    }

    let openImage = this.opening(kernel);
    let newImage = this.subtractImage(openImage, {absolute: true});
    if (iterations > 1) {
        for (let i = 1; i < iterations; i++) {
            openImage = newImage.opening(kernel);
            newImage = openImage.subtractImage(newImage, {absolute: true});
        }
    }
    return newImage;
}
