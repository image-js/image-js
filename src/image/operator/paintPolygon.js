
/**
 * Paint a polygon defined by an array of points.
 * @memberof Image
 * @instance
 * @param {Array<Array<number>>} points - Array of [x,y] points
 * @param {object} [options]
 * @param {Array<number>} [options.color=[max,0,0]] - Array of 3 elements (R, G, B), default is red.
 * @return {this} The original painted image
 */
export default function paintPolygon(points, options = {}) {
    options.closed = true;

    return this.paintPolyline(points, options);
}
