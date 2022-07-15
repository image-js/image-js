import {
  difference,
  normalize,
  Point,
  rotate,
} from '../../utils/geometry/points';
import { Mbr } from '../getMbr';

import { getMbrAngle } from './getMbrAngle';

/**
 * Get the four corners of the minimun bounding rectangle from a set of points defining a simple convex polygon.
 * https://www.researchgate.net/profile/Lennert_Den_Boer2/publication/303783472_A_Fast_Algorithm_for_Generating_a_Minimal_Bounding_Rectangle/links/5751a14108ae6807fafb2aa5.pdf
 *
 * @param points - Points from which to compute the MBR.
 * @returns The array of corners.
 */
export function getMbrFromPoints(points: readonly Point[]): Mbr {
  if (points.length === 0) {
    return {
      corners: [],
      angle: 0,
      width: 0,
      height: 0,
      surface: 0,
      perimeter: 0,
    };
  }
  if (points.length === 1) {
    return {
      corners: [points[0], points[0], points[0], points[0]],
      perimeter: 0,
      surface: 0,
      angle: 0,
      width: 0,
      height: 0,
    };
  }

  let rotatedVertices: Point[] = [];
  let minSurface = Number.POSITIVE_INFINITY;
  let minSurfaceAngle = 0;
  let mbr: Point[] = [];

  for (let i = 0; i < points.length; i++) {
    let angle = getAngle(points[i], points[(i + 1) % points.length]);

    rotatedVertices = rotate(-angle, points);

    // Rotate and translate so that this segment is at the bottom.
    let aX = rotatedVertices[i].column;
    let aY = rotatedVertices[i].row;
    let bX = rotatedVertices[(i + 1) % rotatedVertices.length].column;
    let bY = rotatedVertices[(i + 1) % rotatedVertices.length].row;

    let tUndefined = true;
    let tMin = 0;
    let tMax = 0;
    let maxWidth = 0;
    for (let point of rotatedVertices) {
      let cX = point.column;
      let cY = point.row;
      let t = (cX - aX) / (bX - aX);
      if (tUndefined) {
        tUndefined = false;
        tMin = t;
        tMax = t;
      } else {
        if (t < tMin) tMin = t;
        if (t > tMax) tMax = t;
      }
      let width = (-(bX - aX) * cY + bX * aY - bY * aX) / (bX - aX);

      if (Math.abs(width) > Math.abs(maxWidth)) {
        maxWidth = width;
      }
    }
    let minPoint = { column: aX + tMin * (bX - aX), row: aY };
    let maxPoint = { column: aX + tMax * (bX - aX), row: aY };

    let currentSurface = Math.abs(maxWidth * (tMin - tMax) * (bX - aX));

    if (currentSurface < minSurface) {
      minSurfaceAngle = angle;
      minSurface = currentSurface;
      mbr = [
        maxPoint,
        minPoint,
        { column: minPoint.column, row: minPoint.row - maxWidth },
        { column: maxPoint.column, row: maxPoint.row - maxWidth },
      ];
    }
  }

  const mbrRotated = rotate(minSurfaceAngle, mbr);
  const width = mbr[0].column - mbr[2].column;
  const height = mbr[0].row - mbr[2].row;
  const mbrAngle = getMbrAngle(mbrRotated);

  return {
    corners: mbrRotated,
    surface: minSurface,
    angle: mbrAngle,
    width,
    height,
    perimeter: 2 * width + 2 * height,
  };
}

/**
 * The angle that allows to make the line going through p1 and p2 horizontal.
 * This is an optimized version because it assumes that one of the points is on the line y=0.
 *
 * @param p1 - First point.
 * @param p2 - Second point.
 * @returns Rotation angle to make the line horizontal.
 */
export function getAngle(p1: Point, p2: Point): number {
  let diff = difference(p2, p1);
  let vector = normalize(diff);
  let angle = Math.acos(vector.column);
  if (vector.row < 0) return -angle;
  return angle;
}
