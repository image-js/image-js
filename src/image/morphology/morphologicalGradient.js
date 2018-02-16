/**
 * In mathematical morphology and digital image processing, a morphological gradient is the difference between the dilation and the erosion of a given image. It is an image where each pixel value (typically non-negative) indicates the contrast intensity in the close neighborhood of that pixel. It is useful for edge detection and segmentation applications.
 * http://docs.opencv.org/2.4/doc/tutorials/imgproc/opening_closing_hats/opening_closing_hats.html
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {Array<Array<number>>} [options.kernel] - The kernel can only have ones and zeros. Default: [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
 * @param {number} [options.iterations=1] - Number of iterations of the morphological transform
 * @return {Image}
 */
export default function morphologicalGradient(options = {}) {
  let {
    kernel = [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
    iterations = 1
  } = options;

  this.checkProcessable('morphologicalGradient', {
    bitDepth: [8, 16],
    components: 1,
    alpha: 0
  });
  if (kernel.columns % 2 === 0 || kernel.rows % 2 === 0) {
    throw new TypeError('morphologicalGradient: The number of rows and columns of the kernel must be odd');
  }

  let newImage = this;
  for (let i = 0; i < iterations; i++) {
    let dilatedImage = newImage.dilate({ kernel });
    let erodedImage = newImage.erode({ kernel });
    newImage = dilatedImage.subtractImage(erodedImage, { absolute: true });
  }

  return newImage;
}
