import { IJS } from '../IJS';
import { getOutputImage } from '../utils/getOutputImage';
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

export enum ThresholdAlgorithm {
  HUANG = 'HUANG',
  INTERMODES = 'INTERMODES',
  ISODATA = 'ISODATA',
  LI = 'LI',
  MAX_ENTROPY = 'MAX_ENTROPY',
  MEAN = 'MEAN',
  MIN_ERROR = 'MIN_ERROR',
  MINIMUM = 'MINIMUM',
  MOMENTS = 'MOMENTS',
  OTSU = 'OTSU',
  PERCENTILE = 'PERCENTILE',
  RENYI_ENTROPY = 'RENYI_ENTROPY',
  SHANBHAG = 'SHANBHAG',
  TRIANGLE = 'TRIANGLE',
  YEN = 'YEN',
}

interface ThresholdOptionsBase {
  out?: IJS;
}

export interface ThresholdOptionsThreshold extends ThresholdOptionsBase {
  threshold: number;
}

export interface ThresholdOptionsAlgorithm extends ThresholdOptionsBase {
  algorithm: ThresholdAlgorithm;
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
  image: IJS,
  algorithm: ThresholdAlgorithm,
): number {
  if (image.channels !== 1) {
    throw new Error(
      'threshold can only be computed on images with one channel',
    );
  }
  const histogram = image.histogram();

  switch (algorithm) {
    case ThresholdAlgorithm.HUANG:
      return huang(histogram);
    case ThresholdAlgorithm.INTERMODES:
      return intermodes(histogram);
    case ThresholdAlgorithm.ISODATA:
      return isodata(histogram);
    case ThresholdAlgorithm.LI:
      return li(histogram, image.size);
    case ThresholdAlgorithm.MAX_ENTROPY:
      return maxEntropy(histogram, image.size);
    case ThresholdAlgorithm.MEAN:
      return mean(histogram, image.size);
    case ThresholdAlgorithm.MINIMUM:
      return minimum(histogram);
    case ThresholdAlgorithm.MIN_ERROR:
      return minError(histogram, image.size);
    case ThresholdAlgorithm.MOMENTS:
      return moments(histogram, image.size);
    case ThresholdAlgorithm.OTSU:
      return otsu(histogram, image.size);
    case ThresholdAlgorithm.PERCENTILE:
      return percentile(histogram);
    case ThresholdAlgorithm.RENYI_ENTROPY:
      return renyiEntropy(histogram, image.size);
    case ThresholdAlgorithm.SHANBHAG:
      return shanbhag(histogram, image.size);
    case ThresholdAlgorithm.TRIANGLE:
      return triangle(histogram);
    case ThresholdAlgorithm.YEN:
      return yen(histogram, image.size);
    default:
      throw new RangeError(`unsupported threshold algorithm: ${algorithm}`);
  }
}

// See: https://docs.opencv.org/4.0.1/d7/d1b/group__imgproc__misc.html#gaa9e58d2860d4afa658ef70a9b1115576
/**
 * Create a black and white image based on a threshold value.
 *
 * @param image - The grey image to convert.
 * @param options - Threshold options.
 * @returns The converted image.
 */
export function threshold(image: IJS, options: ThresholdOptions): IJS {
  let thresholdValue: number;
  if ('threshold' in options) {
    thresholdValue = options.threshold;
  } else {
    thresholdValue = computeThreshold(image, options.algorithm);
  }

  validateValue(thresholdValue, image);
  const result = getOutputImage(image, options);
  for (let i = 0; i < image.size; i++) {
    result.setValueByIndex(
      i,
      0,
      image.getValueByIndex(i, 0) > thresholdValue ? image.maxValue : 0,
    );
  }
  return result;
}
