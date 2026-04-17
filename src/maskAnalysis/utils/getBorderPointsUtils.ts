import type { Mask } from '../../Mask.js';

/**
 * Safely get the bit value at the given column and row in the mask, returning 0 if out of bounds.
 * @param mask - Mask to get the bit from.
 * @param col - Column index.
 * @param row - Row index.
 * @returns the bit value.
 */
export function getBitSafe(mask: Mask, col: number, row: number): number {
  if (!isInBounds(mask, col, row)) return 0;
  return mask.getBit(col, row);
}

/**
 * Checks if the given column and row are within the bounds of the mask.
 * @param mask - Mask to check against.
 * @param col - Column index.
 * @param row - Row index.
 * @returns whether the given column and row are within the bounds of the mask.
 */
function isInBounds(mask: Mask, col: number, row: number): boolean {
  return col >= 0 && col < mask.width && row >= 0 && row < mask.height;
}
/**
 * Creates an array to track visited pixels.
 * @param mask - Mask to get array size from.
 * @returns Uint8Array
 */
export function makeVisitedArray(mask: Mask): Uint8Array {
  return new Uint8Array(mask.width * mask.height);
}
