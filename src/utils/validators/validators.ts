import type { Image } from '../../Image.js';
import type { Mask } from '../../Mask.js';

/**
 * Validate an array of channels.
 * @param channels - Array of channels.
 * @param image - The image being processed.
 */
export function validateChannels(channels: number[], image: Image): void {
  for (const channel of channels) {
    validateChannel(channel, image);
  }
}

/**
 * Validates that a channel index passed by the user is within range and is an integer.
 * @param channel - Channel index to validate.
 * @param image - The image being processed.
 */
export function validateChannel(channel: number, image: Image): void {
  if (!Number.isInteger(channel) || channel >= image.channels || channel < 0) {
    throw new RangeError(
      `invalid channel: ${channel}. It must be a positive integer smaller than ${image.channels}`,
    );
  }
}

/**
 * Validates that array of svalues passed by the user are positive and within range.
 * @param values - Array of values to validate.
 * @param image - Image from which the values come.
 */
export function validateValues(values: number[], image: Image): void {
  for (const value of values) {
    validateValue(value, image);
  }
}

/**
 * Validates that a value passed by the user is positive and within range.
 * @param value - Value to validate.
 * @param image - Image from which the value comes.
 */
export function validateValue(value: number, image: Image): void {
  if (value > image.maxValue || value < 0) {
    throw new RangeError(
      `invalid value: ${value}. It must be a positive value smaller than ${
        image.maxValue + 1
      }`,
    );
  }
}

/**
 * Validate that two images are compatible for comparison functions.
 * @param image - First image.
 * @param other - Second image.
 */
export function validateForComparison(
  image: Image | Mask,
  other: Image | Mask,
): void {
  if (image.width !== other.width || image.height !== other.height) {
    throw new RangeError('both images must have the same size');
  }
  if (image.alpha !== other.alpha || image.bitDepth !== other.bitDepth) {
    throw new RangeError('both images must have the same alpha and bitDepth');
  }
  if (image.channels !== other.channels) {
    throw new RangeError('both images must have the same number of channels');
  }
}

/**
 * Checks if the given color is valid.
 * @param color - Color to check.
 * @param image - Image.
 */
export function validateColor(color: number[], image: Image): void {
  validateChannel(color.length - 1, image);
  validateValues(color, image);
}
