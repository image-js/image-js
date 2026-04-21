import type { Mask } from '../Mask.js';
import type { Point } from '../utils/geometry/points.js';

import { getBitSafe } from './utils/getBorderPointsUtils.js';

interface Direction {
  /**
   * Horizontal direction change.
   */
  dc: number;
  /**
   * Vertical direction change.
   */
  dr: number;
}
/**
 * Possible directions.
 */
const directions: Direction[] = [
  { dc: -1, dr: 0 }, // left
  { dc: -1, dr: -1 }, // up-left
  { dc: 0, dr: -1 }, // up
  { dc: 1, dr: -1 }, // up-right
  { dc: 1, dr: 0 }, // right
  { dc: 1, dr: 1 }, // down-right
  { dc: 0, dr: 1 }, // down
  { dc: -1, dr: 1 }, // down-left
];
/**
 * Return an array with the coordinates of the pixels that are on the border of the mask using Moore's tracing algorithm.
 * The reference is the top-left corner of the ROI.
 * @param mask - Mask to process.
 * @returns The array of border pixels.
 */
export function getBorderPointsMoore(mask: Mask): Point[] {
  let index = 0;

  const contour: Point[] = [];
  const visited = new Uint8Array(mask.width * mask.height);
  while (mask.getBitByIndex(index) !== 1 && index !== mask.size) {
    index++;
  }

  if (index === mask.size) return contour;
  const col = index % mask.width;
  const row = Math.floor(index / mask.width);
  const startingPoint = { column: col, row };
  let currentPoint = startingPoint;

  let idx = currentPoint.row * mask.width + currentPoint.column;
  visited[idx] = 1;
  contour.push(currentPoint);

  const firstNext = findNextPoint(mask, currentPoint, { column: col - 1, row });
  if (!firstNext) {
    return contour;
  }

  const startingBacktrackPoints: Point[] = [firstNext.prevPoint];

  let backtrackPoint = firstNext.prevPoint;
  currentPoint = firstNext.currPoint;

  while (true) {
    idx = currentPoint.row * mask.width + currentPoint.column;
    if (!visited[idx]) {
      visited[idx] = 1;
      contour.push(currentPoint);
    }

    const next = findNextPoint(mask, currentPoint, backtrackPoint);
    backtrackPoint = next?.prevPoint as Point;
    currentPoint = next?.currPoint as Point;
    if (
      currentPoint.column === startingPoint.column &&
      currentPoint.row === startingPoint.row
    ) {
      if (
        backtrackPoint.column ===
          (startingBacktrackPoints.at(-1) as Point).column &&
        backtrackPoint.row === (startingBacktrackPoints.at(-1) as Point).row
      ) {
        break;
      } else {
        startingBacktrackPoints.push(backtrackPoint);
      }
    }
  }

  return contour;
}
/**
 * Finds next point to trace.
 * @param mask - Mask in check.
 * @param current - Current border point.
 * @param previous - Last non-border point to start search from.
 * @returns Object with new border point and last non-border point.
 */
function findNextPoint(
  mask: Mask,
  current: Point,
  previous: Point,
): { prevPoint: Point; currPoint: Point } | void {
  let prevPoint = previous;

  // Vector from current back to previous
  const backDc = previous.column - current.column;
  const backDr = previous.row - current.row;

  // Find where that direction is in the array
  const startIndex = directions.findIndex(
    ({ dc, dr }) => dc === backDc && dr === backDr,
  );

  // Scan clockwise starting from that index.
  for (let i = 0; i < directions.length; i++) {
    const { dc, dr } = directions.at(
      (startIndex + i) % directions.length,
    ) as Direction;
    const newCol = current.column + dc;
    const newRow = current.row + dr;
    if (getBitSafe(mask, newCol, newRow) === 1) {
      // Stores found border point and last non-border point that
      // was found. Will be used as a starting point in the next
      // iteration.
      return {
        prevPoint,
        currPoint: { column: newCol, row: newRow },
      };
    } else {
      prevPoint = { column: newCol, row: newRow };
    }
  }
}
