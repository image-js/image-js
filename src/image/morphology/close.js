/**
 * In mathematical morphology, the closing of a set A by a structuring element B is the erosion of the dilation of that set (Wikipedia).
 * In image processing, closing is, together with opening, the basic workhorse of morphological noise removal.
 * Opening removes small objects, while closing removes small holes.
 * http://docs.opencv.org/2.4/doc/tutorials/imgproc/opening_closing_hats/opening_closing_hats.html
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {Array<Array<number>>} [options.kernel] - The kernel can only have ones and zeros. Default: [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
 * @param {number} [options.iterations=1] - Number of iterations of the morphological transform
 * @return {Image}
 */
export default function close(options = {}) {
  let {
    kernel = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    iterations = 1,
  } = options;

  this.checkProcessable('close', {
    bitDepth: [1, 8, 16],
    components: 1,
    alpha: 0,
  });
  if (kernel.columns % 2 === 0 || kernel.rows % 2 === 0) {
    throw new TypeError(
      'close: The number of rows and columns of the kernel must be odd',
    );
  }

  let newImage = this;
  for (let i = 0; i < iterations; i++) {
    newImage = newImage.dilate({ kernel }).erode({ kernel });
  }
  return newImage;
}
