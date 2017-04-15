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

export function dot(p1, p2) {
    return p1[0] * p2[0] + p1[1] * p2[1];
}

export function angle(origin, p1, p2) {
    let v1 = normalize(difference(p1, origin));
    let v2 = normalize(difference(p2, origin));
    let dotProduct = dot(v1, v2);
    // TODO this code is not correct because it may yield the opposite angle
    return Math.acos(dotProduct);
}
