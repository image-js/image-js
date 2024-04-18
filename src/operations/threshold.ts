import { Mask } from '..';
import { Image } from '../Image';
import { imageToOutputMask } from '../utils/getOutputImage';

import huang from './thresholds/huang';
import intermodes from './thresholds/intermodes';
import isodata from './thresholds/isodata';
import li from './thresholds/li';
import maxEntropy from './thresholds/maxEntropy';
import mean from './thresholds/mean';
import minError from './thresholds/minError';
import minimum from './thresholds/minimum';
import moments from './thresholds/moments';
import { otsu } from './thresholds/otsu';
import percentile from './thresholds/percentile';
import renyiEntropy from './thresholds/renyiEntropy';
import shanbhag from './thresholds/shanbhag';
import { triangle } from './thresholds/triangle';
import yen from './thresholds/yen';

export const ThresholdAlgorithm = {
  HUANG: 'huang',
  INTERMODES: 'intermodes',
  ISODATA: 'isodata',
  LI: 'li',
  MAX_ENTROPY: 'maxEntropy',
  MEAN: 'mean',
  MIN_ERROR: 'minError',
  MINIMUM: 'minimum',
  MOMENTS: 'moments',
  OTSU: 'otsu',
  PERCENTILE: 'percentile',
  RENYI_ENTROPY: 'renyiEntropy',
  SHANBHAG: 'shanbhag',
  TRIANGLE: 'triangle',
  YEN: 'yen',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ThresholdAlgorithm =
  (typeof ThresholdAlgorithm)[keyof typeof ThresholdAlgorithm];

interface ThresholdOptionsBase {
  /**
   * Number of slots that histogram can have. Slots must be a power of 2.
   */
  slots?: number;
  /**
   * Image to use as the output.
   */
  out?: Mask;
}

export interface ThresholdOptionsThreshold extends ThresholdOptionsBase {
  /**
   * Threshold value that should be used. Threshold is a value in range [0,1],
   * which will be interpreted as a percentage of image.maxValue.
   */
  threshold: number;
}

export interface ThresholdOptionsAlgorithm extends ThresholdOptionsBase {
  /**
   * Specify a function to computes the threshold value.
   *   @default `'otsu'`
   */
  algorithm?: ThresholdAlgorithm;
}

export type ThresholdOptions =
  | ThresholdOptionsThreshold
  | ThresholdOptionsAlgorithm;

/**
 * Compute threshold value for an image using the specified algorithm.
 * @param image - The grey image.
 * @param options - Threshold options.
 * @returns The threshold value for the image.
 */
export function computeThreshold(
  image: Image,
  options: ThresholdOptionsAlgorithm = {},
): number {
  const { algorithm = 'otsu', slots } = options;
  if (image.channels !== 1) {
    throw new TypeError(
      'threshold can only be computed on images with one channel',
    );
  }
  const histogram = image.histogram({ slots });
  const scale = slots ? 2 ** image.bitDepth / slots : 1;

  switch (algorithm) {
    case 'huang':
      return huang(histogram) * scale;
    case 'intermodes':
      return intermodes(histogram) * scale;
    case 'isodata':
      return isodata(histogram) * scale;
    case 'li':
      return li(histogram, image.size) * scale;
    case 'maxEntropy':
      return maxEntropy(histogram, image.size) * scale;
    case 'mean':
      return mean(histogram, image.size) * scale;
    case 'minimum':
      return minimum(histogram) * scale;
    case 'minError':
      return minError(histogram, image.size) * scale;
    case 'moments':
      return moments(histogram, image.size) * scale;
    case 'otsu':
      return otsu(histogram, image.size) * scale;
    case 'percentile':
      return percentile(histogram) * scale;
    case 'renyiEntropy':
      return renyiEntropy(histogram, image.size) * scale;
    case 'shanbhag':
      return shanbhag(histogram, image.size) * scale;
    case 'triangle':
      return triangle(histogram) * scale;
    case 'yen':
      return yen(histogram, image.size) * scale;
    default:
      throw new RangeError(`invalid threshold algorithm: ${algorithm}`);
  }
}

// See: https://docs.opencv.org/4.0.1/d7/d1b/group__imgproc__misc.html#gaa9e58d2860d4afa658ef70a9b1115576
/**
 * Create a black and white image based on a threshold value.
 * @param image - The grey image to convert.
 * @param options - Threshold options.
 * @returns The resulting mask.
 */
export function threshold(image: Image, options: ThresholdOptions = {}): Mask {
  let thresholdValue: number;

  if ('threshold' in options) {
    const threshold = options.threshold;
    if (threshold < 0 || threshold > 1) {
      throw new RangeError('threshold must be a value between 0 and 1');
    }
    thresholdValue = threshold * image.maxValue;
  } else {
    thresholdValue = computeThreshold(image, options);
  }
  const result = imageToOutputMask(image, options);
  for (let i = 0; i < image.size; i++) {
    result.setBitByIndex(
      i,
      image.getValueByIndex(i, 0) > thresholdValue ? 1 : 0,
    );
  }
  return result;
}
