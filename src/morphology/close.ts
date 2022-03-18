import { ColorDepth, IJS, Mask } from '..';
import { checkKernel } from '../utils/checkKernel';
import checkProcessable from '../utils/checkProcessable';

export interface CloseOptions {
  /**
   * 3x3 matrix. The kernel can only have ones and zeros.
   * Accessing a value: kernel[row][column]
   *
   * @default [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
   */
  kernel?: number[][];
  /**
   * Number of iterations of the algorithm.
   *
   * @default 1
   */
  iterations?: number;
}

export function close(image: IJS, options?: CloseOptions): IJS;
export function close(image: Mask, options?: CloseOptions): Mask;
/**
 * In mathematical morphology, the closing of a set A by a structuring element B is the erosion of the dilation of that set (Wikipedia).
 * In image processing, closing is, together with opening, the basic workhorse of morphological noise removal.
 * Opening removes small objects, while closing removes small holes.
 * http://docs.opencv.org/2.4/doc/tutorials/imgproc/opening_closing_hats/opening_closing_hats.html
 *
 * @param image - Image to process.
 * @param options - Close options.
 * @returns Closed image.
 */
export function close(
  image: IJS | Mask,
  options: CloseOptions = {},
): IJS | Mask {
  let {
    kernel = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    iterations = 1,
  } = options;

  if (image instanceof IJS) {
    checkProcessable(image, 'close', {
      bitDepth: [ColorDepth.UINT1, ColorDepth.UINT8, ColorDepth.UINT16],
      components: 1,
      alpha: false,
    });
  }

  checkKernel(kernel, 'close');

  let newImage = image;
  for (let i = 0; i < iterations; i++) {
    newImage = newImage.dilate({ kernel }).erode({ kernel });
  }
  return newImage;
}
