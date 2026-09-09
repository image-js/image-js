import type { Mask } from '../Mask.ts';
import {
  getPolygonArea,
  getPolygonPerimeter,
} from '../utils/geometry/polygons.ts';

import type { ConvexHull } from './maskAnalysis.types.ts';
import { getExtendedBorderPoints } from './utils/getExtendedBorderPoints.ts';
import { monotoneChainConvexHull as mcch } from './utils/monotoneChainConvexHull.ts';

/**
 * Get the vertices of the convex Hull polygon of a mask.
 * @param mask - Mask to process.
 * @returns Array of the vertices of the convex Hull in clockwise order.
 */
export function getConvexHull(mask: Mask): ConvexHull {
  const borderPoints = getExtendedBorderPoints(mask);
  if (borderPoints.length === 0) {
    return {
      points: [],
      surface: 0,
      perimeter: 0,
    };
  }
  const points = mcch(borderPoints);
  const perimeter = getPolygonPerimeter(points);
  const surface = getPolygonArea(points);
  return { points, perimeter, surface };
}
