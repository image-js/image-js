import { match } from 'ts-pattern';

import type { Image } from '../Image.js';
import type { Mask } from '../Mask.js';
import { imageToOutputMask } from '../utils/getOutputImage.js';

import huang from './thresholds/huang.js';
import intermodes from './thresholds/intermodes.js';
import isodata from './thresholds/isodata.js';
import li from './thresholds/li.js';
import maxEntropy from './thresholds/maxEntropy.js';
import mean from './thresholds/mean.js';
import minError from './thresholds/minError.js';
import minimum from './thresholds/minimum.js';
import moments from './thresholds/moments.js';
import { otsu } from './thresholds/otsu.js';
import percentile from './thresholds/percentile.js';
import renyiEntropy from './thresholds/renyiEntropy.js';
import shanbhag from './thresholds/shanbhag.js';
import { triangle } from './thresholds/triangle.js';
import yen from './thresholds/yen.js';

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

  return match(algorithm)
    .with('huang', () => huang(histogram) * scale)
    .with('intermodes', () => intermodes(histogram) * scale)
    .with('isodata', () => isodata(histogram) * scale)
    .with('li', () => li(histogram, image.size) * scale)
    .with('maxEntropy', () => maxEntropy(histogram, image.size) * scale)
    .with('mean', () => mean(histogram, image.size) * scale)
    .with('minimum', () => minimum(histogram) * scale)
    .with('minError', () => minError(histogram, image.size) * scale)
    .with('moments', () => moments(histogram, image.size) * scale)
    .with('otsu', () => otsu(histogram, image.size) * scale)
    .with('percentile', () => percentile(histogram) * scale)
    .with('renyiEntropy', () => renyiEntropy(histogram, image.size) * scale)
    .with('shanbhag', () => shanbhag(histogram, image.size) * scale)
    .with('triangle', () => triangle(histogram) * scale)
    .with('yen', () => yen(histogram, image.size) * scale)
    .exhaustive();
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
