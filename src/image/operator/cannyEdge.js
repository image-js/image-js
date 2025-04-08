import cannyEdgeDetector from 'canny-edge-detector';

/**
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {number} [options.gaussianBlur=1.1] - Sigma parameter for the gaussian filter step
 * @param {number} [options.lowThreshold=10] - Low threshold for the hysteresis procedure
 * @param {number} [options.highThreshold=30] - High threshold for the hysteresis procedure
 * @return {Image}
 */
export default function cannyEdge(options) {
  return cannyEdgeDetector(this, options);
}
