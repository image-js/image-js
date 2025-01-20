import { Image } from '../Image.js';
import type { Mask } from '../Mask.js';
import { checkKernel } from '../utils/validators/checkKernel.js';
import checkProcessable from '../utils/validators/checkProcessable.js';

export interface CloseOptions {
  /**
   * 3x3 matrix. The kernel can only have ones and zeros.
   * Accessing a value: kernel[row][column].
   * @default `[[1, 1, 1], [1, 1, 1], [1, 1, 1]]`
   */
  kernel?: number[][];
  /**
   * Number of iterations of the algorithm.
   * @default `1`
   */
  iterations?: number;
}

export function close(image: Image, options?: CloseOptions): Image;
export function close(image: Mask, options?: CloseOptions): Mask;
/**
 * In mathematical morphology, the closing of a set A by a structuring element B is the erosion of the dilation of that set (Wikipedia).
 * In image processing, closing is, together with opening, the basic workhorse of morphological noise removal.
 * Opening removes small objects, while closing removes small holes.
 * @see {@link http://docs.opencv.org/2.4/doc/tutorials/imgproc/opening_closing_hats/opening_closing_hats.html}
 * @param image - Image to process.
 * @param options - Close options.
 * @returns Closed image.
 */
export function close(
  image: Image | Mask,
  options: CloseOptions = {},
): Image | Mask {
  const {
    kernel = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    iterations = 1,
  } = options;

  if (image instanceof Image) {
    checkProcessable(image, {
      bitDepth: [1, 8, 16],
      components: 1,
      alpha: false,
    });
  }

  checkKernel(kernel);

  let newImage = image;
  for (let i = 0; i < iterations; i++) {
    newImage = newImage.dilate({ kernel }).erode({ kernel });
  }
  return newImage;
}
