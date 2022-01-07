import { ColorDepth, IJS, Mask } from '..';
import checkProcessable from '../utils/checkProcessable';

export interface OpenOptions {
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

export function open(image: IJS, options?: OpenOptions): IJS;
export function open(image: Mask, options?: OpenOptions): Mask;
/**
 * In mathematical morphology, opening is the dilation of the erosion of a set A by a structuring element B.
 * Together with closing, the opening serves in computer vision and image processing as a basic workhorse of morphological noise removal.
 * Opening removes small objects from the foreground (usually taken as the bright pixels) of an image,
 * placing them in the background, while closing removes small holes in the foreground, changing small islands of background into foreground. (Wikipedia)
 * http://docs.opencv.org/2.4/doc/tutorials/imgproc/opening_closing_hats/opening_closing_hats.html
 *
 * @param image - Image to process.
 * @param options - Open options
 * @returns The opened image
 */
export function open(image: IJS | Mask, options: OpenOptions = {}): IJS | Mask {
  let {
    kernel = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    iterations = 1,
  } = options;

  if (image instanceof IJS) {
    checkProcessable(image, 'open', {
      bitDepth: [ColorDepth.UINT1, ColorDepth.UINT8, ColorDepth.UINT16],
      components: 1,
      alpha: false,
    });
  }

  if (kernel.length % 2 === 0 || kernel[0].length % 2 === 0) {
    throw new TypeError(
      'open: The number of rows and columns of the kernel must be odd',
    );
  }

  let newImage = image;
  for (let i = 0; i < iterations; i++) {
    newImage = newImage.erode({ kernel });
    newImage = newImage.dilate({ kernel });
  }

  console.log(newImage);
  return newImage;
}
