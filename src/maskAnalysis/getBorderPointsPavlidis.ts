import type { Mask } from '../Mask.ts';
import type { Point } from '../utils/geometry/points.ts';

import { getBitSafe } from './utils/getBorderPointsUtils.ts';

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
 * Return an array with the coordinates of the pixels that are on the
 * external border of the mask using Theo Pavlidis's tracing algorithm.
 * The reference is the top-left corner of the ROI.
 * @param mask - Mask to process.
 * @returns The array of external border pixels.
 */
export function getBorderPointsPavlidis(mask: Mask): Point[] {
  let index = 0;
  while (index < mask.size && mask.getBitByIndex(index) !== 1) {
    index++;
  }
  if (index === mask.size) return [];
  const col = index % mask.width;
  const row = Math.floor(index / mask.width);

  return traceFrom(mask, col, row);
}

/**
 * Traces contour using Pavlidis algorithm.
 * @param mask - Mask in check.
 * @param startCol - Starting column.
 * @param startRow - Starting row.
 * @returns Array of contour points.
 */
function traceFrom(mask: Mask, startCol: number, startRow: number): Point[] {
  let row = startRow;
  let column = startCol;
  let dir: Direction = getStartDirection(mask, column, row);
  let inPlaceTurns = 0;
  const seen = new Uint8Array(mask.width * mask.height);
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
 * Get starting direction to trace contour.
 * @param mask - Mask in check.
 * @param col - Pixel column.
 * @param row - Pixel row.
 * @returns Direction.
 */
function getStartDirection(mask: Mask, col: number, row: number): Direction {
  if (getBitSafe(mask, col, row - 1) === 0) return 2; // N is background, face S
  if (getBitSafe(mask, col + 1, row) === 0) return 3; // E is background, face W
  if (getBitSafe(mask, col, row + 1) === 0) return 0; // S is background, face N
  return 1; // W is background, face E
}
