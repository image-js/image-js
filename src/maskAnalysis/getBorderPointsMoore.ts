import type { Mask } from '../Mask.js';
import type { Point } from '../utils/geometry/points.js';

import { getBitSafe } from './getBorderPointsPavlidis.ts';
import type { GetBorderPointsOptions } from './maskAnalysis.types.js';

interface Direction {
  dc: number;
  dr: number;
}
/**
 * Return an array with the coordinates of the pixels that are on the border of the mask using Moore's tracing algorithm.
 * The reference is the top-left corner of the ROI.
 * @param mask - Mask to process.
 * @param options - Get border points options.
 * @returns The array of border pixels.
 */
export function getBorderPointsMoore(
  mask: Mask,
  options: GetBorderPointsOptions = {},
): Point[] {
  const { innerBorders = false } = options;
  if (!innerBorders) {
    mask = mask.solidFill();
  }

  const contour: Point[] = [];
  const visited = new Uint8Array(mask.width * mask.height);

  function isVisited(p: Point) {
    return visited[p.row * mask.width + p.column] === 1;
  }
  function markVisited(p: Point) {
    visited[p.row * mask.width + p.column] = 1;
  }

  for (let row = 0; row < mask.height; row++) {
    for (let col = 0; col < mask.width; col++) {
      const p = { column: col, row };
      if (isBorderPixel(mask, col, row) && !isVisited(p)) {
        const startingPoint = p;
        const fakePrevious = findBackgroundNeighbor(mask, col, row);
        contour.push(startingPoint);
        markVisited(startingPoint);
        const { currPoint, prevPoint } = findNextPoint(
          mask,
          startingPoint,
          fakePrevious as Point,
        ) as { currPoint: Point; prevPoint: Point };
        contour.push(currPoint);
        markVisited(currPoint);
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
          );
          backtrackPoint = currentPoints?.prevPoint as Point;
          currentPoint = currentPoints?.currPoint as Point;
          if (!isVisited(currentPoint)) {
            contour.push(currentPoint);
            markVisited(currentPoint);
          }
        }
      }
    }
  }
  return contour;
}

function findNextPoint(
  mask: Mask,
  current: Point,
  previous: Point,
): { prevPoint: Point; currPoint: Point } | void {
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

  // Vector from current back to previous
  const backDc = previous.column - current.column;
  const backDr = previous.row - current.row;

  // Find where that direction is in the array
  const startIndex = directions.findIndex(
    ({ dc, dr }) => dc === backDc && dr === backDr,
  );

  // Scan clockwise starting from that index
  for (let i = 0; i <= directions.length; i++) {
    const { dc, dr } = directions.at(
      (startIndex + i) % directions.length,
    ) as Direction;
    const newCol = current.column + dc;
    const newRow = current.row + dr;
    if (getBitSafe(mask, newCol, newRow) === 1) {
      return {
        prevPoint,
        currPoint: { column: newCol, row: newRow },
      };
    } else {
      prevPoint = { column: newCol, row: newRow };
    }
  }
}

function isBorderPixel(mask: Mask, col: number, row: number) {
  if (getBitSafe(mask, col, row) !== 1) return false;

  return (
    getBitSafe(mask, col + 1, row) === 0 ||
    getBitSafe(mask, col - 1, row) === 0 ||
    getBitSafe(mask, col, row + 1) === 0 ||
    getBitSafe(mask, col, row - 1) === 0
  );
}

function findBackgroundNeighbor(
  mask: Mask,
  col: number,
  row: number,
): Point | void {
  const candidates = [
    { column: col - 1, row },
    { column: col + 1, row },
    { column: col, row: row - 1 },
    { column: col, row: row + 1 },
  ];

  for (const p of candidates) {
    if (getBitSafe(mask, p.column, p.row) === 0) {
      return p;
    }
  }
}
