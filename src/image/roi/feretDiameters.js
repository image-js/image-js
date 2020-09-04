import { rotate, difference, normalize } from '../../util/points';
import convexHullFunction from '../compute/monotoneChainConvexHull';

/**
 * Computes the Feret diameters
 * https://www.sympatec.com/en/particle-measurement/glossary/particle-shape/#
 * http://portal.s2nano.org:8282/files/TEM_protocol_NANoREG.pdf
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {Array<Array<number>>} [options.originalPoints]
 * @return {object} Object with {min, max, minLine: {Array<Array<number>>}, maxLine: {Array<Array<number>>}}
 */
export default function feretDiameters(options = {}) {
  const { originalPoints = convexHullFunction.call(this) } = options;
  if (originalPoints.length === 0) {
    return { min: 0, max: 0, minLine: [], maxLine: [], aspectRatio: 1 };
  }

  if (originalPoints.length === 1) {
    return {
      min: 1,
      max: 1,
      minLine: [originalPoints[0], originalPoints[0]],
      maxLine: [originalPoints[0], originalPoints[0]],
      aspectRatio: 1,
    };
  }

  const temporaryPoints = new Array(originalPoints.length);

  // CALCULATE MIN VALUE
  let minWidth = +Infinity;
  let minWidthAngle = 0;
  let minLine = [];

  for (let i = 0; i < originalPoints.length; i++) {
    let angle = getAngle(
      originalPoints[i],
      originalPoints[(i + 1) % originalPoints.length],
    );

    // we rotate so that it is parallel to X axis
    rotate(-angle, originalPoints, temporaryPoints);

    let currentWidth = 0;
    let currentMinLine = [];
    for (let j = 0; j < originalPoints.length; j++) {
      let absWidth = Math.abs(temporaryPoints[i][1] - temporaryPoints[j][1]);
      if (absWidth > currentWidth) {
        currentWidth = absWidth;
        currentMinLine = [];
        currentMinLine.push(
          [temporaryPoints[j][0], temporaryPoints[i][1]],
          [temporaryPoints[j][0], temporaryPoints[j][1]],
        );
      }
    }
    if (currentWidth < minWidth) {
      minWidth = currentWidth;
      minWidthAngle = angle;
      minLine = currentMinLine;
    }
  }
  rotate(minWidthAngle, minLine, minLine);

  // CALCULATE MAX VALUE
  let maxWidth = 0;
  let maxLine = [];
  let maxSquaredWidth = 0;
  for (let i = 0; i < originalPoints.length - 1; i++) {
    for (let j = i + 1; j < originalPoints.length; j++) {
      let currentSquaredWidth =
        (originalPoints[i][0] - originalPoints[j][0]) ** 2 +
        (originalPoints[i][1] - originalPoints[j][1]) ** 2;
      if (currentSquaredWidth > maxSquaredWidth) {
        maxSquaredWidth = currentSquaredWidth;
        maxWidth = Math.sqrt(currentSquaredWidth);
        maxLine = [originalPoints[i], originalPoints[j]];
      }
    }
  }

  return {
    min: minWidth,
    minLine,
    max: maxWidth,
    maxLine,
    aspectRatio: minWidth / maxWidth,
  };
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
