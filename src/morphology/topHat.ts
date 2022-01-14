import { ColorDepth, IJS, Mask } from '..';
import { subtractImage } from '../filters';
import { checkKernel } from '../utils/checkKernel';
import checkProcessable from '../utils/checkProcessable';

export interface TopHatOptions {
  /**
   * 3x3 matrix. The kernel can only have ones and zeros.
   * Accessing a value: kernel[row][column]
   */
  kernel?: number[][];
  /**
   * Number of iterations of the algorithm.
   */
  iterations?: number;
}

export function topHat(image: IJS, options?: TopHatOptions): IJS;
export function topHat(image: Mask, options?: TopHatOptions): Mask;
/**
 * This function is the white top hat (also called top hat). In mathematical morphology and digital image processing,
 * top-hat transform is an operation that extracts small elements and details from given images.
 * The white top-hat transform is defined as the difference between the input image and its opening by some structuring element.
 * Top-hat transforms are used for various image processing tasks, such as feature extraction, background equalization, image enhancement, and others. (Wikipedia)
 * http://docs.opencv.org/2.4/doc/tutorials/imgproc/opening_closing_hats/opening_closing_hats.html
 *
 * @param image - Image to process
 * @param options - Top hat options
 * @returns The top-hatted image
 */
export function topHat(
  image: IJS | Mask,
  options: TopHatOptions = {},
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
    checkProcessable(image, 'topHat', {
      bitDepth: [ColorDepth.UINT1, ColorDepth.UINT8, ColorDepth.UINT16],
      components: 1,
      alpha: false,
    });
  }

  checkKernel(kernel, 'topHat');

  let newImage = image;
  for (let i = 0; i < iterations; i++) {
    let openImage = newImage.open({ kernel });
    newImage = subtractImage(openImage, newImage, { absolute: true });
  }
  return newImage;
}
