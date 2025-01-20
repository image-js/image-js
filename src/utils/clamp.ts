import type { Image } from '../Image.js';

import type { ClampFunction } from './utils.types.js';
import { assert } from './validators/assert.js';

/**
 * Get the clamp function for an image (depends on the image bit depth).
 * @param image - The image for which the clamp function is needed.
 * @returns The clamp function.
 */
export function getClamp(image: Image): ClampFunction {
  if (image.maxValue === 255) {
    return clamp255;
  } else {
    assert(image.maxValue === 65535);
    return clamp65535;
  }
}

/**
 * Clamp value for 8-bit images.
 * @param value - Value to clamp.
 * @returns The clamped value.
 */
function clamp255(value: number): number {
  return Math.min(Math.max(value, 0), 255);
}

/**
 * Clamp value for 16-bit images.
 * @param value - Value to clamp.
 * @returns The clamped value.
 */
function clamp65535(value: number): number {
  return Math.min(Math.max(value, 0), 65535);
}

/**
 * Get a function that clamps a value to a given range.
 * @param min - Lower threshold.
 * @param max - Upper threshold.
 * @returns The clamping function.
 */
export function getClampFromTo(min: number, max: number) {
  return function clamp(value: number) {
    return Math.max(Math.min(value, max), min);
  };
}
