import { Mask } from '..';
import { Image } from '../Image';
import { imageToOutputMask } from '../utils/getOutputImage';
import { validateValue } from '../utils/validators';

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
   * Image to use as the output.
   */
  out?: Mask;
}

export interface ThresholdOptionsThreshold extends ThresholdOptionsBase {
  /**
   * Threshold value that should be used. Should be an integer between 0 and Image.maxValue or a value in percents as a string, like "40%".
   */
  threshold: number | string;
}

export interface ThresholdOptionsAlgorithm extends ThresholdOptionsBase {
  /**
   * Specify a function to computes the threshold value.
   *
   *   @default 'otsu'
   */
  algorithm?: ThresholdAlgorithm;
}

export type ThresholdOptions =
  | ThresholdOptionsThreshold
  | ThresholdOptionsAlgorithm;

/**
 * Compute threshold value for an image using the specified algorithm.
 *
 * @param image - The grey image.
 * @param algorithm - Algorithm that defines the threshold.
 * @returns The threshold value for the image.
 */
export function computeThreshold(
  image: Image,
  algorithm: ThresholdAlgorithm = 'otsu',
): number {
  if (image.channels !== 1) {
    throw new TypeError(
      'threshold can only be computed on images with one channel',
    );
  }
  const histogram = image.histogram();

  switch (algorithm) {
    case 'huang':
      return huang(histogram);
    case 'intermodes':
      return intermodes(histogram);
    case 'isodata':
      return isodata(histogram);
    case 'li':
      return li(histogram, image.size);
    case 'maxEntropy':
      return maxEntropy(histogram, image.size);
    case 'mean':
      return mean(histogram, image.size);
    case 'minimum':
      return minimum(histogram);
    case 'minError':
      return minError(histogram, image.size);
    case 'moments':
      return moments(histogram, image.size);
    case 'otsu':
      return otsu(histogram, image.size);
    case 'percentile':
      return percentile(histogram);
    case 'renyiEntropy':
      return renyiEntropy(histogram, image.size);
    case 'shanbhag':
      return shanbhag(histogram, image.size);
    case 'triangle':
      return triangle(histogram);
    case 'yen':
      return yen(histogram, image.size);
    default:
      throw new RangeError(`invalid threshold algorithm: ${algorithm}`);
  }
}

// See: https://docs.opencv.org/4.0.1/d7/d1b/group__imgproc__misc.html#gaa9e58d2860d4afa658ef70a9b1115576
/**
 * Create a black and white image based on a threshold value.
 *
 * @param image - The grey image to convert.
 * @param options - Threshold options.
 * @returns The resulting mask.
 */
export function threshold(image: Image, options: ThresholdOptions = {}): Mask {
  let thresholdValue: number;
  if ('threshold' in options) {
    const threshold = options.threshold;
    if (typeof threshold === 'number') {
      thresholdValue = threshold;
    } else if (
      typeof threshold === 'string' &&
      threshold.endsWith('%') &&
      !Number.isNaN(Number(threshold.slice(0, -1)))
    ) {
      const percents = Number(threshold.slice(0, -1));
      if (percents < 0 || percents > 100) {
        throw new RangeError(
          'threshold: threshold in percents is out of range 0 to 100',
        );
      }
      thresholdValue = (percents / 100) * image.maxValue;
    } else {
      throw new Error('threshold: unrecognised threshold format');
    }
  } else {
    thresholdValue = computeThreshold(image, options.algorithm);
  }
  validateValue(thresholdValue, image);
  const result = imageToOutputMask(image, options);
  for (let i = 0; i < image.size; i++) {
    result.setBitByIndex(
      i,
      image.getValueByIndex(i, 0) > thresholdValue ? 1 : 0,
    );
  }
  return result;
}
