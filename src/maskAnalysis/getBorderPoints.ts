import type { Mask } from '../Mask.js';
import type { Point } from '../utils/geometry/points.js';

import type { GetBorderPointsOptions } from './maskAnalysis.types.js';

interface Direction {
  dc: number;
  dr: number;
}

/**
 * Return an array with the coordinates of the pixels that are on the border of the mask.
 * The reference is the top-left corner of the ROI.
 * @param mask - Mask to process.
 * @param options - Get border points options.
 * @returns The array of border pixels.
 */

export function getBorderPoints(
  mask: Mask,
  options: GetBorderPointsOptions = {},
): Point[] {
  const { innerBorders = false, allowCorners = false } = options;

  let index = 0;

  while (mask.getBitByIndex(index) !== 1) {
    if (mask.getBitByIndex(index) === 1) {
      break;
    } else {
      index++;
    }
  }
  const col = index % mask.width;
  const row = Math.floor(index / mask.width);
  const startingPoint = { column: col, row };
  console.log(
    `Starting point: (${startingPoint.column}, ${startingPoint.row})`,
  );
  const fakePrevious = { column: col - 1, row };
  const contour = [startingPoint];
  const { currPoint, prevPoint } = findNextPoint(
    mask,
    startingPoint,
    fakePrevious,
    allowCorners,
  );
  contour.push(currPoint);
  let backtrackPoint = prevPoint;
  let currentPoint = currPoint;
  while (
    currentPoint.column !== startingPoint.column ||
    currentPoint.row !== startingPoint.row
  ) {
    const currentPoints = findNextPoint(
      mask,
      currentPoint,
      backtrackPoint,
      allowCorners,
    );
    backtrackPoint = currentPoints.prevPoint;
    currentPoint = currentPoints.currPoint;
    contour.push(currentPoints.currPoint);
  }
  return contour;
}

function findNextPoint(
  mask: Mask,
  current: Point,
  previous: Point,
  allowCorners = false,
): { prevPoint: Point; currPoint: Point } {
  let prevPoint = previous;
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
  const iterationSize = allowCorners ? 1 : 2;

  // Vector from current back to previous
  const backDc = previous.column - current.column;
  const backDr = previous.row - current.row;

  // Find where that direction is in the array
  let startIndex = directions.findIndex(
    ({ dc, dr }) => dc === backDc && dr === backDr,
  );

  if (!allowCorners && startIndex % 2 !== 0) {
    startIndex = (startIndex + 1) % directions.length;
  }
  // Scan clockwise starting from that index
  for (let i = 0; i <= directions.length; i += iterationSize) {
    const { dc, dr } = directions.at(
      (startIndex + i) % directions.length,
    ) as Direction;
    const newCol = current.column + dc;
    const newRow = current.row + dr;
    if (getBitSafe(mask, newCol, newRow) === 1) {
      console.log(
        `Found next point at (${newCol}, ${newRow}), previous was (${prevPoint.column}, ${prevPoint.row})`,
      );
      return {
        prevPoint,
        currPoint: { column: newCol, row: newRow },
      };
    } else {
      console.log(
        `No next point found yet.Prev point that becomes current (${prevPoint.column}, ${prevPoint.row})`,
      );
      prevPoint = { column: newCol, row: newRow };
    }
  }

  // Should never happen for a valid closed contour
  throw new Error(`No next point found at (${current.column}, ${current.row})`);
}

function isInBounds(mask: Mask, col: number, row: number): boolean {
  return col >= 0 && col < mask.width && row >= 0 && row < mask.height;
}

function getBitSafe(mask: Mask, col: number, row: number): number {
  return isInBounds(mask, col, row) ? mask.getBit(col, row) : 0;
}
