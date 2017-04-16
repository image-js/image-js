/**
 * Rounds all the x and y values of an array of points
 * @param points
 * @returns {*}
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
 * @param p1
 * @param p2
 * @returns {[*,*]}
 */
export function difference(p1, p2) {
    return [p1[0] - p2[0], p1[1] - p2[1]];
}

/**
 * Normalize a point
 * @param p
 * @returns {[*,*]}
 */
export function normalize(p) {
    let length = Math.sqrt(p[0] ** 2 + p[1] ** 2);
    return [p[0] / length, p[1] / length];
}

/**
 * We rotate an array of points
 * @param radians
 * @param srcPoints
 * @param destPoints
 * @returns {*}
 */
export function rotate(radians, srcPoints, destPoints) {
    if (destPoints === undefined) destPoints = new Array(srcPoints.length);
    let cos = Math.cos(radians);
    let sin = Math.sin(radians);
    for (let i = 0; i < destPoints.length; ++i) {
        destPoints[i] = [
            cos * srcPoints[i][0] - sin * srcPoints[i][1],
            sin * srcPoints[i][0] + cos * srcPoints[i][1]
        ];
    }
    return destPoints;
}

/**
 * Dot products of 2 points assuming vectors starting from (0,0)
 * @param p1
 * @param p2
 * @returns {number}
 */
export function dot(p1, p2) {
    return p1[0] * p2[0] + p1[1] * p2[1];
}

/**
 * Returns the angle between 3 points. The first one is a common point
 * @param origin
 * @param p1
 * @param p2
 * @returns {number}
 */
export function angle(origin, p1, p2) {
    let v1 = normalize(difference(p1, origin));
    let v2 = normalize(difference(p2, origin));
    let dotProduct = dot(v1, v2);
    // TODO this code is not correct because it may yield the opposite angle
    return Math.acos(dotProduct);
}

/**
 * Returns the 4 points of an horizontal rectangle that includes all the oints
 * @param points
 */
export function boundary(points) {
    let minMaxValues = minMax(points);
    let xMin = minMaxValues[0][0];
    let yMin = minMaxValues[0][1];
    let xMax = minMaxValues[1][0];
    let yMax = minMaxValues[1][1];
    return [[xMin, yMin], [xMax, yMin], [xMax, yMax], [xMin, yMax]];
}

/**
 * Returns 2 points with minimal and maximal XY
 * @param points
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
        if (points[i][1] < yMax) yMax = points[i][1];
    }
    return [[xMin, yMin], [xMax, yMax]];
}

/**
 * Moves the minX, minY to 0,0
 * All the points will be positive after this move
 * @param srcPoints
 * @param destPoints
 */
export function moveToZeroZero(srcPoints, destPoints) {
    if (destPoints === undefined) destPoints = new Array(srcPoints.length);
    let minMaxValues = minMax(srcPoints);
    let xMin = minMaxValues[0][0];
    let yMin = minMaxValues[0][1];
    for (let i = 0; i < srcPoints.length; i++) {
        destPoints[i][0] = srcPoints[i][0] - xMin;
        destPoints[i][1] = srcPoints[i][1] - yMin;
    }
    return destPoints;
}

