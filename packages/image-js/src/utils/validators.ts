import { Image } from '../Image';

export function validateChannel(channel: number, image: Image): void {
  if (!Number.isInteger(channel) || channel >= image.channels || channel < 0) {
    throw new RangeError(
      `invalid channel: ${channel}. It must be a positive integer smaller than ${
        image.channels
      }`
    );
  }
}

/**
 * Validates that a value passed by the user is smaller than the image's maxValue.
 */
export function validateValue(value: number, image: Image): void {
  if (!Number.isInteger(value) || value > image.maxValue || value < 0) {
    throw new RangeError(
      `invalid value: ${value}. It must be a positive integer smaller than ${image.maxValue +
        1}`
    );
  }
}
