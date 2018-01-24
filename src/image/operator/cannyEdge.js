import cannyEdgeDetector from 'canny-edge-detector';

/**
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @return {Image}
 */
export default function cannyEdge(options) {
  return cannyEdgeDetector(this, options);
}
