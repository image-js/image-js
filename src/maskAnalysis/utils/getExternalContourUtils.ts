import type { Mask } from '../../Mask.ts';
/**
 * Gets point's row and column from their index and mask width.
 * @param index - point's index.
 * @param maskWidth - mask width.
 * @returns array of point's row and column.
 */
export function getCoordsFromIndex(index: number, maskWidth: number) {
  return [Math.floor(index / maskWidth), index % maskWidth];
}

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
