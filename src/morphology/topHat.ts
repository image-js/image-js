import { Image } from '../Image.js';
import type { Mask } from '../Mask.js';
import { subtract } from '../compare/index.js';
import { checkKernel } from '../utils/validators/checkKernel.js';
import checkProcessable from '../utils/validators/checkProcessable.js';

export interface TopHatOptions {
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

export function topHat(image: Image, options?: TopHatOptions): Image;
export function topHat(image: Mask, options?: TopHatOptions): Mask;
/**
 * This function is the white top hat (also called top hat). In mathematical morphology and digital image processing,
 * top-hat transform is an operation that extracts small elements and details from given images.
 * The white top-hat transform is defined as the difference between the input image and its opening by some structuring element.
 * Top-hat transforms are used for various image processing tasks, such as feature extraction, background equalization, image enhancement, and others. (Wikipedia)
 * @see {@link http://docs.opencv.org/2.4/doc/tutorials/imgproc/opening_closing_hats/opening_closing_hats.html}
 * @param image - Image to process.
 * @param options - Top hat options.
 * @returns The top-hatted image.
 */
export function topHat(
  image: Image | Mask,
  options: TopHatOptions = {},
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
    const openImage = newImage.open({ kernel });
    newImage = subtract(openImage, newImage, { absolute: true });
  }
  return newImage;
}
