import type { Mask } from '../Mask.js';
import {
  getPolygonArea,
  getPolygonPerimeter,
} from '../utils/geometry/polygons.js';

import type { ConvexHull } from './maskAnalysis.types.js';
import { getExtendedBorderPoints } from './utils/getExtendedBorderPoints.js';
import { monotoneChainConvexHull as mcch } from './utils/monotoneChainConvexHull.js';

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
