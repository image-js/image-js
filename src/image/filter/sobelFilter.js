import { SOBEL_X, SOBEL_Y } from '../../util/kernels';

import gradientFilter from './gradientFilter';

/**
 * Applies the Sobel operator.
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {GradientDirection} [options.direction]
 * @param {string} [options.border='copy']
 * @param {*} [options.channels]
 * @param {number} [options.bitDepth=this.bitDepth] Specify the bitDepth of the resulting image
 * @return {Image}
 * @see {@link https://en.wikipedia.org/wiki/Sobel_operator}
 */
export default function sobelFilter(options) {
  return gradientFilter.call(this, Object.assign({}, options, {
    kernelX: SOBEL_X,
    kernelY: SOBEL_Y
  }));
}
