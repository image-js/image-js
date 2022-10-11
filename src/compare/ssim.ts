import { ssim as bufferSsim, Options as BufferSsimOptions } from 'ssim.js';

import { ColorDepth, Image } from '..';
import checkProcessable from '../utils/checkProcessable';
import { validateForComparison } from '../utils/validators';

export interface SsimOptions extends BufferSsimOptions {
  /**
   * Window size for SSIM map.
   *
   * @default Number.min(11, image.width, image.height)
   */
  windowSize: number;
}

/**
 * Compute the Structural Similarity (SSIM) of two GREY images.
 * "The resultant SSIM index is a decimal value between -1 and 1,
 * where 1 indicates perfect similarity, 0 indicates no similarity,
 * and -1 indicates perfect anti-correlation." -
 * https://en.wikipedia.org/wiki/Structural_similarity
 *
 * @param image - First image.
 * @param otherImage - Second image.
 * @param options
 * @returns SSIM of the two images.
 */
export function ssim(
  image: Image,
  otherImage: Image,
  options: Partial<SsimOptions>,
): number {
  if (options.windowSize) {
    options.windowSize = Math.min(11, image.height, image.width);
  }
  checkProcessable(image, 'ssim', {
    bitDepth: [ColorDepth.UINT8, ColorDepth.UINT16],
    components: [1],
    alpha: false,
  });

  validateForComparison('ssim', image, otherImage);

  const imageData = new Uint8ClampedArray(image.getRawImage().data);
  const imageBuffer = {
    height: image.height,
    width: image.width,
    data: imageData,
  };
  const otherData = new Uint8ClampedArray(otherImage.getRawImage().data);
  const otherBuffer = {
    height: otherImage.height,
    width: otherImage.width,
    data: otherData,
  };

  console.log({ imageBuffer });
  console.log({ otherBuffer });

  // TODO: handle 16 bits images -> check lib options
  const ssim = bufferSsim(imageBuffer, otherBuffer, options);

  console.log({ ssim });

  return ssim.mssim;
}
