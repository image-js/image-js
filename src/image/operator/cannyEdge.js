import cannyEdgeDetector from 'canny-edge-detector';

/**
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {number} [options.gaussianBlur] - Sigma parameter for the gaussian filter step (default: 1.1)
 * @param {number} [options.lowThreshold] - Low threshold for the hysteresis procedure (default: 10)
 * @param {number} [options.highThreshold] - High threshold for the hysteresis procedure (default: 30)
 * @return {Image}
 */
export default function cannyEdge(options) {
  return cannyEdgeDetector(this, options);
}
