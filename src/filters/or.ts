import type { Mask } from '../Mask.js';
import { maskToOutputMask } from '../utils/getOutputImage.js';

export interface OrOptions {
  /**
   * Image to which the resulting image has to be put.
   */
  out?: Mask;
}

/**
 * Perform an OR operation on two masks.
 * @param mask - First mask.
 * @param otherMask - Second mask.
 * @param options - Or options.
 * @returns OR of the two masks.
 */
export function or(mask: Mask, otherMask: Mask, options?: OrOptions): Mask {
  const newMask = maskToOutputMask(mask, options);

  if (mask.width !== otherMask.width || mask.height !== otherMask.height) {
    throw new RangeError('both masks must have the same size');
  }

  for (let i = 0; i < newMask.size; i++) {
    if (mask.getBitByIndex(i) || otherMask.getBitByIndex(i)) {
      newMask.setBitByIndex(i, 1);
    } else {
      newMask.setBitByIndex(i, 0);
    }
  }
  return newMask;
}
