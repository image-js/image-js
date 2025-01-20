import type { Image } from '../Image.js';
import checkProcessable from '../utils/validators/checkProcessable.js';

import type { CropAlphaOptions } from './operations.types.js';

/**
 * Crops the image based on the alpha channel
 * This removes lines and columns where the alpha channel is lower than a threshold value.
 * @param image - Image to process.
 * @param options - Crop alpha options.
 * @returns The cropped image.
 */
export function cropAlpha(image: Image, options: CropAlphaOptions = {}): Image {
  checkProcessable(image, {
    alpha: true,
  });

  const { threshold = image.maxValue } = options;

  const left = findLeft(image, threshold, image.components);

  if (left === -1) {
    throw new RangeError(
      `could not find new dimensions. Threshold may be too high: ${threshold}`,
    );
  }

  const top = findTop(image, threshold, image.components, left);
  const bottom = findBottom(image, threshold, image.components, left);
  const right = findRight(
    image,
    threshold,
    image.components,
    left,
    top,
    bottom,
  );

  return image.crop({
    origin: { column: left, row: top },
    width: right - left + 1,
    height: bottom - top + 1,
  });
}

function findLeft(image: Image, threshold: number, channel: number) {
  for (let row = 0; row < image.width; row++) {
    for (let column = 0; column < image.height; column++) {
      if (image.getValue(row, column, channel) >= threshold) {
        return row;
      }
    }
  }
  return -1;
}

function findTop(
  image: Image,
  threshold: number,
  channel: number,
  left: number,
) {
  for (let row = 0; row < image.height; row++) {
    for (let column = left; column < image.width; column++) {
      if (image.getValue(column, row, channel) >= threshold) {
        return row;
      }
    }
  }
  /* istanbul ignore next */
  return -1;
}

function findBottom(
  image: Image,
  threshold: number,
  channel: number,
  left: number,
) {
  for (let row = image.height - 1; row >= 0; row--) {
    for (let column = left; column < image.width; column++) {
      if (image.getValue(column, row, channel) >= threshold) {
        return row;
      }
    }
  }
  /* istanbul ignore next */
  return -1;
}

function findRight(
  image: Image,
  threshold: number,
  channel: number,
  left: number,
  top: number,
  bottom: number,
) {
  for (let row = image.width - 1; row >= left; row--) {
    for (let column = top; column <= bottom; column++) {
      if (image.getValue(row, column, channel) >= threshold) {
        return row;
      }
    }
  }
  /* istanbul ignore next */
  return -1;
}
