import type { Point } from '../index_full.ts';

export interface ConvexityDefectsOptions {
  /**
   * Depth threshold to remove smaller convexity defaults.
   * @default 0
   */
  depthThreshold?: number;
}

/**
 * Find border points that are farthest from its convex hull lines. Inspired by openCV's convexityDefects.
 * @param borderPoints - Mask's border points.
 * @param hullPoints - Mask's convex hull points.
 * @param options - Convexity defects options.
 * @returns Array of convexity defects.
 */
export function getConvexityDefects(
  borderPoints: Point[],
  hullPoints: Point[],
  options: ConvexityDefectsOptions = {},
): Point[] {
  const { depthThreshold = 0 } = options;
  const defects = [];

  if (hullPoints.length === 0) {
    throw new RangeError(
      'No hull points were defined for convexity defects detection.',
    );
  }
  if (borderPoints.length === 0) {
    throw new RangeError(
      'No border points were defined for convexity defects detection.',
    );
  }

  const lastHullPoint = hullPoints.at(-1) as Point;

  let currBorderIndex = borderPoints.findIndex((bp) =>
    limitReached(bp, lastHullPoint),
  );

  if (currBorderIndex === -1) {
    throw new RangeError(
      'Could not find a border point matching the convex hull endpoint.',
    );
  }
  for (let i = hullPoints.length - 1; i >= 0; i--) {
    const currHullPoint = hullPoints.at(i);
    const nextHullPoint = hullPoints.at(i - 1);
    if (!currHullPoint || !nextHullPoint) continue;
    const v0x = nextHullPoint.column - currHullPoint.column;
    const v0y = nextHullPoint.row - currHullPoint.row;
    const edgeLenSq = v0x * v0x + v0y * v0y;
    let maxDepth = 0;
    let maxDepthIndex = -1;
    const segmentStart = currBorderIndex;
    let reached = false;
    for (let j = 0; j < borderPoints.length; j++) {
      const checkIndex = (segmentStart + j) % borderPoints.length;
      const bp = borderPoints[checkIndex];
      if (limitReached(bp, nextHullPoint)) {
        currBorderIndex = (checkIndex + 1) % borderPoints.length;
        reached = true;
        break;
      }

      const v1x = bp.column - currHullPoint.column;
      const v1y = bp.row - currHullPoint.row;

      const t = Math.max(0, Math.min(1, (v1x * v0x + v1y * v0y) / edgeLenSq));
      const closestX = currHullPoint.column + t * v0x;
      const closestY = currHullPoint.row + t * v0y;
      const depth = Math.hypot(bp.column - closestX, bp.row - closestY);
      if (depth > maxDepth) {
        maxDepth = depth;
        maxDepthIndex = checkIndex;
      }
    }
    if (!reached) {
      throw new RangeError(
        'Could not reach the next hull point while scanning border points; hull and border may be inconsistent.',
      );
    }
    if (maxDepth > depthThreshold) {
      const defectPoint = borderPoints[maxDepthIndex];
      if (defectPoint) defects.push(defectPoint);
    }
  }

  return defects;
}
/**
 * Checks if borderPoint reached convex hull's point.
 * @param borderPoint - Border point.
 * @param hullPoint - Endpoint of convex hull segment.
 * @returns whether endpoint is reached.
 */
function limitReached(borderPoint: Point, hullPoint: Point): boolean {
  const tolerance = 1;
  return (
    Math.abs(borderPoint.column - hullPoint.column) <= tolerance &&
    Math.abs(borderPoint.row - hullPoint.row) <= tolerance
  );
}
