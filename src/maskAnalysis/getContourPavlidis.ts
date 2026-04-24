import type { Mask } from '../Mask.ts';
import type { Point } from '../utils/geometry/points.ts';

import {
  getBitSafe,
  getCoordsFromIndex,
} from './utils/getExternalContourUtils.ts';

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
export function getContourPavlidis(mask: Mask): Point[] {
  let index = 0;
  while (index < mask.size && mask.getBitByIndex(index) !== 1) {
    index++;
  }
  if (index === mask.size) return [];
  const [row, col] = getCoordsFromIndex(index, mask.width);

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
  let dir: Direction = 2;
  let inPlaceTurns = 0;
  const seen = new Uint8Array(mask.width * mask.height);
  const contour: Point[] = [];
  let visits = 0;
  while (true) {
    const idx = row * mask.width + column;
    if (!seen[idx]) {
      seen[idx] = 1;
      contour.push({ row, column });
    } else if (row === startRow && column === startCol) {
      if (visits === 2) {
        break;
      } else {
        visits++;
      }
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
  }

  return contour;
}
