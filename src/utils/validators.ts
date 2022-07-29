import { Image } from '../Image';

/**
 * Validate an array of channels.
 *
 * @param channels - Array of channels.
 * @param image - The image being processed
 */
export function validateChannels(channels: number[], image: Image): void {
  for (const channel of channels) {
    validateChannel(channel, image);
  }
}

/**
 * Validates that a channel index passed by the user is within range and is an integer.
 *
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
 * Validates that a value passed by the user is within range and is an integer.
 *
 * @param value - Value to validate.
 * @param image - Image from which the value comes.
 */
export function validateValue(value: number, image: Image): void {
  if (!Number.isInteger(value) || value > image.maxValue || value < 0) {
    throw new RangeError(
      `invalid value: ${value}. It must be a positive integer smaller than ${
        image.maxValue + 1
      }`,
    );
  }
}
