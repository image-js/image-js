/**
 * In mathematical morphology, opening is the dilation of the erosion of a set A by a structuring element B.
 * Together with closing, the opening serves in computer vision and image processing as a basic workhorse of morphological noise removal.
 * Opening removes small objects from the foreground (usually taken as the bright pixels) of an image,
 * placing them in the background, while closing removes small holes in the foreground, changing small islands of background into foreground. (Wikipedia)
 * http://docs.opencv.org/2.4/doc/tutorials/imgproc/opening_closing_hats/opening_closing_hats.html
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {Array<Array<number>>} [options.kernel] - The kernel can only have ones and zeros. Default: [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
 * @param {number} [options.iterations=1] - Number of iterations of the morphological transform
 * @return {Image}
 */
export default function open(options = {}) {
  let {
    kernel = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    iterations = 1,
  } = options;

  this.checkProcessable('open', {
    bitDepth: [8, 16],
    components: 1,
    alpha: 0,
  });
  if (kernel.columns % 2 === 0 || kernel.rows % 2 === 0) {
    throw new TypeError(
      'open: The number of rows and columns of the kernel must be odd',
    );
  }

  let newImage = this;
  for (let i = 0; i < iterations; i++) {
    newImage = newImage.erode({ kernel });
    newImage = newImage.dilate({ kernel });
  }
  return newImage;
}
