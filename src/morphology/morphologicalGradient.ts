import { Image } from '../Image.js';
import type { Mask } from '../Mask.js';
import { subtract } from '../compare/index.js';
import { checkKernel } from '../utils/validators/checkKernel.js';
import checkProcessable from '../utils/validators/checkProcessable.js';

export interface MorphologicalGradientOptions {
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

export function morphologicalGradient(
  image: Image,
  options?: MorphologicalGradientOptions,
): Image;
export function morphologicalGradient(
  image: Mask,
  options?: MorphologicalGradientOptions,
): Mask;
/**
 * In mathematical morphology and digital image processing, a morphological gradient is the difference between the dilation and the erosion of a given image. It is an image where each pixel value (typically non-negative) indicates the contrast intensity in the close neighborhood of that pixel. It is useful for edge detection and segmentation applications.
 * @see {@link http://docs.opencv.org/2.4/doc/tutorials/imgproc/opening_closing_hats/opening_closing_hats.html}
 * @param image - Image to process.
 * @param options - Morphological gradient hat options.
 * @returns The processed image.
 */
export function morphologicalGradient(
  image: Image | Mask,
  options: MorphologicalGradientOptions = {},
) {
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
    const dilatedImage = newImage.dilate({ kernel });
    const erodedImage = newImage.erode({ kernel });
    newImage = subtract(dilatedImage, erodedImage, { absolute: true });
  }

  return newImage;
}
