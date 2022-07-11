import { Mask } from '../Mask';
import { Point } from '../utils/geometry/points';
import {
  getPolygonArea,
  getPolygonPerimeter,
} from '../utils/geometry/polygons';

import { monotoneChainConvexHull as mcch } from './utils/monotoneChainConvexHull';

/**
 * Convex Hull polygon of a mask.
 */
export interface ConvexHull {
  /**
   * Vertices of the convex Hull in clockwise order.
   */
  points: Point[];
  /**
   * Perimeter of the convex Hull.
   */
  perimeter: number;
  /**
   * Surface of the convex Hull.
   */
  surface: number;
}

/**
 * Get the vertices of the convex Hull polygon of a mask.
 *
 * @param mask - Mask to process.
 * @returns Array of the vertices of the convex Hull in clockwise order.
 */
export function getConvexHull(mask: Mask): ConvexHull {
  const borderPoints = mask.getBorderPoints();
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
