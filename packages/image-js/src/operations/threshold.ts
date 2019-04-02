import { Image } from '../Image';
import { validateValue } from '../utils/validators';
import { getOutputImage } from '../utils/getOutputImage';

import { otsu } from './thresholds/otsu';
import { triangle } from './thresholds/triangle';

// TODO: convert more algorithms to TS.
export enum ThresholdAlgorithm {
  // HUANG,
  // INTERMODES,
  // ISODATA,
  // LI,
  // MAX_ENTROPY,
  // MEAN,
  // MIN_ERROR,
  // MINIMUM,
  // MOMENTS,
  OTSU,
  // PERCENTILE,
  // RENYI_ENTROPY,
  // SHANBHAG,
  TRIANGLE
  // YEN
}

export interface IThresholdOptions {
  algorithm?: ThresholdAlgorithm;
  threshold?: number;
  out?: Image;
}

export function computeThreshold(
  image: Image,
  algorithm: ThresholdAlgorithm
): number {
  if (image.channels !== 1) {
    throw new Error(
      'threshold can only be computed on images with one channel'
    );
  }
  const histogram = image.histogram();

  switch (algorithm) {
    case ThresholdAlgorithm.OTSU:
      return otsu(histogram, image.size);
    case ThresholdAlgorithm.TRIANGLE:
      return triangle(histogram);
    default:
      throw new RangeError(`unsupported threshold algorithm: ${algorithm}`);
  }
}

// TODO: add support for other threshold types.
// See: https://docs.opencv.org/4.0.1/d7/d1b/group__imgproc__misc.html#gaa9e58d2860d4afa658ef70a9b1115576
export function threshold(
  image: Image,
  options: IThresholdOptions = {}
): Image {
  const { algorithm = ThresholdAlgorithm.OTSU, threshold } = options;
  let thresholdValue: number;
  if (typeof threshold === 'number') {
    thresholdValue = threshold;
  } else {
    thresholdValue = computeThreshold(image, algorithm);
  }
  validateValue(thresholdValue, image);
  const result = getOutputImage(image, options);
  for (let i = 0; i < image.data.length; i++) {
    result.data[i] = image.data[i] > thresholdValue ? image.maxValue : 0;
  }

  return result;
}
