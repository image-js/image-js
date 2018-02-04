import { methods, names } from '../transform/mask/thresholdAlgorithms';

/**
 * Returns a threshold for the creation of a binary mask with the `mask()` method.
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {ThresholdAlgorithm} [options.algorithm='otsu']
 * @return {number}
 */
export default function getThreshold(options = {}) {
  let {
    algorithm = names.otsu
  } = options;

  this.checkProcessable('getThreshold', {
    components: 1,
    bitDepth: [8, 16]
  });

  let method = methods[algorithm.toLowerCase()];
  if (method) {
    let histogram = this.getHistogram();
    return method(histogram, this.size);
  } else {
    throw new Error(`unknown thresholding algorithm: ${algorithm}`);
  }
}
