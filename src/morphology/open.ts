import { Image } from '../Image.js';
import type { Mask } from '../Mask.js';
import { checkKernel } from '../utils/validators/checkKernel.js';
import checkProcessable from '../utils/validators/checkProcessable.js';

export interface OpenOptions {
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

export function open(image: Image, options?: OpenOptions): Image;
export function open(image: Mask, options?: OpenOptions): Mask;
/**
 * In mathematical morphology, opening is the dilation of the erosion of a set A by a structuring element B.
 * Together with closing, the opening serves in computer vision and image processing as a basic workhorse of morphological noise removal.
 * Opening removes small objects from the foreground (usually taken as the bright pixels) of an image,
 * placing them in the background, while closing removes small holes in the foreground, changing small islands of background into foreground. (Wikipedia)
 * @see {@link http://docs.opencv.org/2.4/doc/tutorials/imgproc/opening_closing_hats/opening_closing_hats.html}
 * @param image - Image to process.
 * @param options - Open options.
 * @returns The opened image.
 */
export function open(
  image: Image | Mask,
  options: OpenOptions = {},
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
    newImage = newImage.erode({ kernel });
    newImage = newImage.dilate({ kernel });
  }

  return newImage;
}
