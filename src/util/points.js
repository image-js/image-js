/**
 * Rounds all the x and y values of an array of points
 * @param {Array<Array<number>>} points
 * @return {Array<Array<number>>} modified input value
 * @private
 */
export function round(points) {
  for (let i = 0; i < points.length; i++) {
    points[i][0] = Math.round(points[i][0]);
    points[i][1] = Math.round(points[i][1]);
  }
  return points;
}

/**
 * Calculates a new point that is the difference p1 - p2
 * @param {Array<number>} p1
 * @param {Array<number>} p2
 * @return {Array<number>}
 * @private
 */
export function difference(p1, p2) {
  return [p1[0] - p2[0], p1[1] - p2[1]];
}

/**
 * Normalize a point
 * @param {Array<number>} p
 * @return {Array<number>}
 * @private
 */
export function normalize(p) {
  let length = Math.sqrt(p[0] ** 2 + p[1] ** 2);
  return [p[0] / length, p[1] / length];
}

/**
 * We rotate an array of points
 * @param {number} radians
 * @param {Array<Array<number>>} srcPoints
 * @param {Array<Array<number>>} destPoints
 * @return {Array<Array<number>>}
 * @private
 */
export function rotate(radians, srcPoints, destPoints) {
  if (destPoints === undefined) destPoints = new Array(srcPoints.length);
  let cos = Math.cos(radians);
  let sin = Math.sin(radians);
  for (let i = 0; i < destPoints.length; ++i) {
    destPoints[i] = [
      cos * srcPoints[i][0] - sin * srcPoints[i][1],
      sin * srcPoints[i][0] + cos * srcPoints[i][1],
    ];
  }
  return destPoints;
}

/**
 * Dot products of 2 points assuming vectors starting from (0,0)
 * @param {Array<number>} p1
 * @param {Array<number>} p2
 * @return {number}
 * @private
 */
export function dot(p1, p2) {
  return p1[0] * p2[0] + p1[1] * p2[1];
}

/**
 * Returns the angle between 3 points. The first one is a common point
 * @param {Array<number>} origin
 * @param {Array<number>} p1
 * @param {Array<number>} p2
 * @return {number}
 * @private
 */
export function angle(origin, p1, p2) {
  let v1 = normalize(difference(p1, origin));
  let v2 = normalize(difference(p2, origin));
  let dotProduct = dot(v1, v2);
  // TODO this code is not correct because it may yield the opposite angle
  return Math.acos(dotProduct);
}

/**
 * Returns the 4 points of an horizontal rectangle that includes all the points
 * @param {Array<Array<number>>} points
 * @return {Array<Array<number>>}
 * @private
 */
export function boundary(points) {
  let minMaxValues = minMax(points);
  let xMin = minMaxValues[0][0];
  let yMin = minMaxValues[0][1];
  let xMax = minMaxValues[1][0];
  let yMax = minMaxValues[1][1];
  return [
    [xMin, yMin],
    [xMax, yMin],
    [xMax, yMax],
    [xMin, yMax],
  ];
}

/**
 * Returns the perimeter represented by the points (a polygon)
 * @param {Array<Array<number>>} points
 */
export function perimeter(vertices) {
  let total = 0;
  for (let i = 0; i < vertices.length; i++) {
    let fromX = vertices[i][0];
    let fromY = vertices[i][1];
    let toX = vertices[i === vertices.length - 1 ? 0 : i + 1][0];
    let toY = vertices[i === vertices.length - 1 ? 0 : i + 1][1];
    total += Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
  }
  return total;
}

/**
 * Returns the surface represented by the points (a polygon)
 * @param {Array<Array<number>>} points
 */
export function surface(vertices) {
  let total = 0;

  for (let i = 0; i < vertices.length; i++) {
    let addX = vertices[i][0];
    let addY = vertices[i === vertices.length - 1 ? 0 : i + 1][1];
    let subX = vertices[i === vertices.length - 1 ? 0 : i + 1][0];
    let subY = vertices[i][1];

    total += addX * addY * 0.5;
    total -= subX * subY * 0.5;
  }

  return Math.abs(total);
}

/**
 * Returns 2 points with minimal and maximal XY
 * @param {Array<Array<number>>} points
 * @return {Array<Array<number>>}
 * @private
 */
export function minMax(points) {
  let xMin = +Infinity;
  let yMin = +Infinity;
  let xMax = -Infinity;
  let yMax = -Infinity;
  for (let i = 0; i < points.length; i++) {
    if (points[i][0] < xMin) xMin = points[i][0];
    if (points[i][0] > xMax) xMax = points[i][0];
    if (points[i][1] < yMin) yMin = points[i][1];
    if (points[i][1] > yMax) yMax = points[i][1];
  }
  return [
    [xMin, yMin],
    [xMax, yMax],
  ];
}

/**
 * Moves the minX, minY to 0,0
 * All the points will be positive after this move
 * @param {Array<Array<number>>} srcPoints
 * @param {Array<Array<number>>} destPoints
 * @return {Array<Array<number>>}
 * @private
 */
export function moveToZeroZero(srcPoints, destPoints) {
  if (destPoints === undefined) {
    destPoints = new Array(srcPoints.length).fill(0).map(() => []);
  }
  let minMaxValues = minMax(srcPoints);
  let xMin = minMaxValues[0][0];
  let yMin = minMaxValues[0][1];
  for (let i = 0; i < srcPoints.length; i++) {
    destPoints[i][0] = srcPoints[i][0] - xMin;
    destPoints[i][1] = srcPoints[i][1] - yMin;
  }
  return destPoints;
}
