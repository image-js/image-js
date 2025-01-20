import type { Mask } from '../Mask.js';
import { maskToOutputMask } from '../utils/getOutputImage.js';

export interface AndOptions {
  /**
   * Image to which the resulting image has to be put.
   */
  out?: Mask;
}

/**
 * Perform an AND operation on two masks.
 * @param mask - First mask.
 * @param otherMask - Second mask.
 * @param options - And options.
 * @returns AND of the two masks.
 */
export function and(mask: Mask, otherMask: Mask, options?: AndOptions): Mask {
  const newMask = maskToOutputMask(mask, options);

  if (mask.width !== otherMask.width || mask.height !== otherMask.height) {
    throw new RangeError('both masks must have the same size');
  }

  for (let i = 0; i < newMask.size; i++) {
    if (mask.getBitByIndex(i) && otherMask.getBitByIndex(i)) {
      newMask.setBitByIndex(i, 1);
    } else {
      newMask.setBitByIndex(i, 0);
    }
  }
  return newMask;
}
