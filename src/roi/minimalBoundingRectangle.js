import { rotate, difference, normalize } from '../../util/points';

import convexHullFunction from './monotoneChainConvexHull';

/**
 * Computes the minimum bounding box around a binary image
 * https://www.researchgate.net/profile/Lennert_Den_Boer2/publication/303783472_A_Fast_Algorithm_for_Generating_a_Minimal_Bounding_Rectangle/links/5751a14108ae6807fafb2aa5.pdf
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {Array<Array<number>>} [options.originalPoints]
 * @return {Array<Array<number>>}
 */
export default function minimalBoundingRectangle(options = {}) {
  const { originalPoints = convexHullFunction.call(this) } = options;
  if (originalPoints.length === 0) {
    return [];
  }

  if (originalPoints.length === 1) {
    return [
      originalPoints[0],
      originalPoints[0],
      originalPoints[0],
      originalPoints[0],
    ];
  }

  const p = new Array(originalPoints.length);

  let minSurface = +Infinity;
  let minSurfaceAngle = 0;
  let mbr;

  for (let i = 0; i < p.length; i++) {
    let angle = getAngle(originalPoints[i], originalPoints[(i + 1) % p.length]);

    rotate(-angle, originalPoints, p);

    // we rotate and translate so that this axe is in the bottom
    let aX = p[i][0];
    let aY = p[i][1];
    let bX = p[(i + 1) % p.length][0];
    let bY = p[(i + 1) % p.length][1];

    let tUndefined = true;
    let tMin = 0;
    let tMax = 0;
    let maxWidth = 0;
    for (let j = 0; j < p.length; j++) {
      let cX = p[j][0];
      let cY = p[j][1];
      let t = (cX - aX) / (bX - aX);
      if (tUndefined === true) {
        tUndefined = false;
        tMin = t;
        tMax = t;
      } else {
        if (t < tMin) tMin = t;
        if (t > tMax) tMax = t;
      }
      let width = (-(bX - aX) * cY + bX * aY - bY * aX) / (bX - aX);

      if (Math.abs(width) > Math.abs(maxWidth)) maxWidth = width;
    }
    let pMin = [aX + tMin * (bX - aX), aY];
    let pMax = [aX + tMax * (bX - aX), aY];

    let currentSurface = Math.abs(maxWidth * (tMin - tMax) * (bX - aX));

    if (currentSurface < minSurface) {
      minSurfaceAngle = angle;
      minSurface = currentSurface;
      mbr = [
        pMin,
        pMax,
        [pMax[0], pMax[1] - maxWidth],
        [pMin[0], pMin[1] - maxWidth],
      ];
    }
  }
  rotate(minSurfaceAngle, mbr, mbr);
  return mbr;
}

// the angle that allows to make the line going through p1 and p2 horizontal
// this is an optimized version because it assume one vector is horizontal
function getAngle(p1, p2) {
  let diff = difference(p2, p1);
  let vector = normalize(diff);
  let angle = Math.acos(vector[0]);
  if (vector[1] < 0) return -angle;
  return angle;
}
