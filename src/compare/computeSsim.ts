import { ssim as bufferSsim } from 'ssim.js';

import { ColorDepth, Image, ImageColorModel } from '..';
import checkProcessable from '../utils/checkProcessable';
import { validateForComparison } from '../utils/validators';

export interface SsimOptions {
  /**
   * Window size for SSIM map.
   *
   * @default Math.min(11, image.width, image.height)
   */
  windowSize?: number;
  /**
   * Algorithm to use to compute the SSIM.
   *
   * @default 'original'
   */
  algorithm?: 'fast' | 'original' | 'bezkrovny' | 'weber';
}

export interface Ssim {
  /**
   * Mean SSIM of the whole image. It is the mean value of the SSIM map.
   * It is a similarity score between two images.
   */
  mssim: number;
  /**
   * Similarity map of the two images. The dimensions of the map depend the windowSize option.
   * Create a GREY image based on this map to visualize the similarity of the different regions of the image.
   */
  ssimMap: { data: number[]; width: number; height: number };
}

/**
 * Compute the Structural Similarity (SSIM) of two RGBA or two GREY images.
 * "The resultant SSIM index is a decimal value between -1 and 1,
 * where 1 indicates perfect similarity, 0 indicates no similarity,
 * and -1 indicates perfect anti-correlation." -
 * https://en.wikipedia.org/wiki/Structural_similarity
 *
 * @param image - First image.
 * @param otherImage - Second image.
 * @param options - SSIM options.
 * @returns SSIM of the two images.
 */
export function computeSsim(
  image: Image,
  otherImage: Image,
  options: SsimOptions = {},
): Ssim {
  let { windowSize, algorithm = 'original' } = options;

  if (windowSize) {
    if (windowSize > image.width || windowSize > image.height) {
      throw new Error('ssim: windowSize cannot exceed image dimensions');
    }
  } else {
    windowSize = Math.min(11, image.height, image.width);
  }
  checkProcessable(image, 'ssim', {
    bitDepth: [ColorDepth.UINT8],
    channels: [1, 3, 4],
  });

  validateForComparison('ssim', image, otherImage);

  if (image.colorModel !== ImageColorModel.RGBA) {
    image = image.convertColor(ImageColorModel.RGBA);
    otherImage = otherImage.convertColor(ImageColorModel.RGBA);
  }

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

  const ssim = bufferSsim(imageBuffer, otherBuffer, {
    windowSize,
    ssim: algorithm,
  });

  return {
    mssim: ssim.mssim,
    ssimMap: ssim.ssim_map,
  };
}
