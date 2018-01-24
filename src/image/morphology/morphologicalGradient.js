import Matrix from 'ml-matrix';

/**
 * In mathematical morphology and digital image processing, a morphological gradient is the difference between the dilation and the erosion of a given image. It is an image where each pixel value (typically non-negative) indicates the contrast intensity in the close neighborhood of that pixel. It is useful for edge detection and segmentation applications.
 * http://docs.opencv.org/2.4/doc/tutorials/imgproc/opening_closing_hats/opening_closing_hats.html
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {Matrix} [options.kernel]
 * @param {number} [options.iterations] - number of iterations of the morphological transform
 * @return {Image}
 */
export default function morphologicalGradient(options = {}) {
  let {
    kernel = new Matrix([[1, 1, 1], [1, 1, 1], [1, 1, 1]]),
    iterations = 1
  } = options;

  this.checkProcessable('morphologicalGradient', {
    bitDepth: [8, 16],
    channel: [1]
  });
  if (kernel.columns - 1 % 2 === 0 || kernel.rows - 1 % 2 === 0) {
    throw new TypeError('morphologicalGradient: The number of rows and columns of the kernel must be odd');
  }

  let dilatedImage = this.dilate({ kernel: kernel });
  let erodedImage = this.erode({ kernel: kernel });
  let newImage = dilatedImage.subtractImage(erodedImage, { absolute: true });
  if (iterations > 1) {
    for (let i = 1; i < iterations; i++) {
      dilatedImage = newImage.dilate({ kernel: kernel });
      erodedImage = newImage.erode({ kernel: kernel });
      newImage = dilatedImage.subtractImage(erodedImage, { absolute: true });
    }
  }
  return newImage;
}
