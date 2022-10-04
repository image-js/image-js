import { ColorDepth, Image, Mask } from '..';
import { subtract } from '../compare';
import { checkKernel } from '../utils/checkKernel';
import checkProcessable from '../utils/checkProcessable';

export interface BottomHatOptions {
  /**
   * 3x3 matrix. The kernel can only have ones and zeros.
   * Accessing a value: kernel[row][column].
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

export function bottomHat(image: Image, options?: BottomHatOptions): Image;
export function bottomHat(image: Mask, options?: BottomHatOptions): Mask;
/**
 * This function is the black top hat (also called bottom hat).
 * In mathematical morphology and digital image processing,
 * top-hat transform is an operation that extracts small elements and details from given images.
 * The black top-hat transform is defined dually as the difference between the closed and the input image.
 * Top-hat transforms are used for various image processing tasks, such as feature extraction, background equalization,
 * image enhancement, and others. (Wikipedia)
 * http://docs.opencv.org/2.4/doc/tutorials/imgproc/opening_closing_hats/opening_closing_hats.html
 *
 * @param image - Image to process
 * @param options - Bottom hat options
 * @returns The bottom-hatted image
 */
export function bottomHat(
  image: Image | Mask,
  options: BottomHatOptions = {},
): Image | Mask {
  let {
    kernel = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    iterations = 1,
  } = options;

  if (image instanceof Image) {
    checkProcessable(image, 'bottomHat', {
      bitDepth: [ColorDepth.UINT1, ColorDepth.UINT8, ColorDepth.UINT16],
      components: 1,
      alpha: false,
    });
  }

  checkKernel(kernel, 'bottomHat');

  let newImage = image;
  for (let i = 0; i < iterations; i++) {
    let openImage = newImage.close({ kernel });
    newImage = subtract(openImage, newImage, { absolute: true });
  }
  return newImage;
}
