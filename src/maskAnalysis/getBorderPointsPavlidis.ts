import type { Mask } from '../Mask.ts';
import type { Point } from '../utils/geometry/points.ts';

import type { GetBorderPointsOptions } from './maskAnalysis.types.ts';

type Direction = 0 | 1 | 2 | 3; // N, E, S, W

const DR = [-1, 0, 1, 0];
const DC = [0, 1, 0, -1];

function turnLeft(d: Direction): Direction {
  return ((d + 3) % 4) as Direction;
}

function turnRight(d: Direction): Direction {
  return ((d + 1) % 4) as Direction;
}
/**
 * Return an array with the coordinates of the pixels that are on the border of the mask using Theo Pavlidis's tracing algorithm.
 * The reference is the top-left corner of the ROI.
 * @param mask - Mask to process.
 * @param options - Get border points options.
 * @returns The array of border pixels.
 */
export function getBorderPointsPavlidis(
  mask: Mask,
  options: GetBorderPointsOptions,
): Point[] {
  const { innerBorders = false } = options;
  if (!innerBorders) {
    mask = mask.solidFill();
  }
  const contours: Point[] = [];
  const seen = new Uint8Array(mask.width * mask.height);

  for (let r = 0; r < mask.height; r++) {
    for (let c = 0; c < mask.width; c++) {
      const idx = r * mask.width + c;
      if (mask.getBit(c, r) !== 1) continue;
      if (seen[idx] === 1) continue;

      const contour = traceFrom(mask, c, r, seen);
      for (const p of contour) {
        contours.push(p);
      }
    }
  }
  return contours;
}
function traceFrom(
  mask: Mask,
  startCol: number,
  startRow: number,
  seen: Uint8Array,
): Point[] {
  let row = startRow;
  let column = startCol;
  let dir: Direction = 1;
  let inPlaceTurns = 0;

  const contour: Point[] = [];

  do {
    const idx = row * mask.width + column;
    if (!seen[idx]) {
      seen[idx] = 1;
      contour.push({ row, column });
    }

    const left = turnLeft(dir);
    const right = turnRight(dir);

    const c1r = row + DR[left];
    const c1c = column + DC[left];

    const c2r = row + DR[dir];
    const c2c = column + DC[dir];

    const c3r = row + DR[right];
    const c3c = column + DC[right];

    if (getBitSafe(mask, c1c, c1r) === 1) {
      dir = left;
      row = c1r;
      column = c1c;
      inPlaceTurns = 0;
    } else if (getBitSafe(mask, c2c, c2r) === 1) {
      row = c2r;
      column = c2c;
      inPlaceTurns = 0;
    } else if (getBitSafe(mask, c3c, c3r) === 1) {
      dir = right;
      row = c3r;
      column = c3c;
      inPlaceTurns = 0;
    } else {
      dir = right;
      inPlaceTurns++;
      if (inPlaceTurns >= 4) break;
    }
  } while (row !== startRow || column !== startCol);

  return contour;
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
 * Safely get the bit value at the given column and row in the mask, returning 0 if out of bounds.
 * @param mask - Mask to get the bit from.
 * @param col - Column index.
 * @param row - Row index.
 * @returns the bit value.
 */
export function getBitSafe(mask: Mask, col: number, row: number): number {
  return isInBounds(mask, col, row) ? mask.getBit(col, row) : 0;
}
