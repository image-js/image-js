/**
 * This function is the black top hat (also called black hat).
 * In mathematical morphology and digital image processing,
 * top-hat transform is an operation that extracts small elements and details from given images.
 * The black top-hat transform is defined dually as the difference between the closed and the input image.
 * Top-hat transforms are used for various image processing tasks, such as feature extraction, background equalization,
 * image enhancement, and others. (Wikipedia)
 * http://docs.opencv.org/2.4/doc/tutorials/imgproc/opening_closing_hats/opening_closing_hats.html
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {Array<Array<number>>} [options.kernel] - The kernel can only have ones and zeros. Default: [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
 * @param {number} [options.iterations=1] - Number of iterations of the morphological transform
 * @return {Image}
 */
export default function blackHat(options = {}) {
  let {
    kernel = [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
    iterations = 1
  } = options;

  this.checkProcessable('blackHat', {
    bitDepth: [8, 16],
    components: 1,
    alpha: 0
  });
  if (kernel.columns % 2 === 0 || kernel.rows % 2 === 0) {
    throw new TypeError('blackHat: The number of rows and columns of the kernel must be odd');
  }

  let newImage = this;
  for (let i = 0; i < iterations; i++) {
    const closeImage = newImage.close({ kernel });
    newImage = closeImage.subtractImage(newImage, { absolute: true });
  }
  return newImage;
}
